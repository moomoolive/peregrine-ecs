import { SIZEOF, typedArray } from "@thi.ng/api/typedarray";
import { align } from "@thi.ng/binary/align";
import { isNumber } from "@thi.ng/checks/is-number";
import { assert } from "@thi.ng/errors/assert";
import { illegalArgs } from "@thi.ng/errors/illegal-arguments";
const STATE_FREE = 0;
const STATE_USED = 1;
const STATE_TOP = 2;
const STATE_END = 3;
const STATE_ALIGN = 4;
const STATE_FLAGS = 5;
const STATE_MIN_SPLIT = 6;
const MASK_COMPACT = 1;
const MASK_SPLIT = 2;
const SIZEOF_STATE = 7 * 4;
const MEM_BLOCK_SIZE = 0;
const MEM_BLOCK_NEXT = 1;
const SIZEOF_MEM_BLOCK = 2 * 4;
export class MemPool {
    constructor(opts = {}) {
        this.buf = opts.buf ? opts.buf : new ArrayBuffer(opts.size || 0x1000);
        this.start = opts.start != null ? align(Math.max(opts.start, 0), 4) : 0;
        this.u8 = new Uint8Array(this.buf);
        this.u32 = new Uint32Array(this.buf);
        this.state = new Uint32Array(this.buf, this.start, SIZEOF_STATE / 4);
        if (!opts.skipInitialization) {
            const _align = opts.align || 8;
            assert(_align >= 8, `invalid alignment: ${_align}, must be a pow2 and >= 8`);
            const top = this.initialTop(_align);
            const resolvedEnd = opts.end != null
                ? Math.min(opts.end, this.buf.byteLength)
                : this.buf.byteLength;
            if (top >= resolvedEnd) {
                illegalArgs(`insufficient address range (0x${this.start.toString(16)} - 0x${resolvedEnd.toString(16)})`);
            }
            this.align = _align;
            this.doCompact = opts.compact !== false;
            this.doSplit = opts.split !== false;
            this.minSplit = opts.minSplit || 16;
            this.end = resolvedEnd;
            this.top = top;
            this._free = 0;
            this._used = 0;
        }
    }
    stats() {
        const listStats = (block) => {
            let count = 0;
            let size = 0;
            while (block) {
                count++;
                size += this.blockSize(block);
                block = this.blockNext(block);
            }
            return { count, size };
        };
        const free = listStats(this._free);
        return {
            free,
            used: listStats(this._used),
            top: this.top,
            available: this.end - this.top + free.size,
            total: this.buf.byteLength,
        };
    }
    callocAs(type, num, fill = 0) {
        const block = this.mallocAs(type, num);
        block && block.fill(fill);
        return block;
    }
    mallocAs(type, num) {
        const addr = this.malloc(num * SIZEOF[type]);
        return addr ? typedArray(type, this.buf, addr, num) : undefined;
    }
    calloc(bytes, fill = 0) {
        const addr = this.malloc(bytes);
        addr && this.u8.fill(fill, addr, addr + bytes);
        return addr;
    }
    malloc(bytes) {
        if (bytes <= 0) {
            return 0;
        }
        const paddedSize = align(bytes + SIZEOF_MEM_BLOCK, this.align);
        const end = this.end;
        let top = this.top;
        let block = this._free;
        let prev = 0;
        while (block) {
            const blockSize = this.blockSize(block);
            const isTop = block + blockSize >= top;
            if (isTop || blockSize >= paddedSize) {
                return this.mallocTop(block, prev, blockSize, paddedSize, isTop);
            }
            prev = block;
            block = this.blockNext(block);
        }
        block = top;
        top = block + paddedSize;
        if (top <= end) {
            this.initBlock(block, paddedSize, this._used);
            this._used = block;
            this.top = top;
            return blockDataAddress(block);
        }
        return 0;
    }
    mallocTop(block, prev, blockSize, paddedSize, isTop) {
        if (isTop && block + paddedSize > this.end)
            return 0;
        if (prev) {
            this.unlinkBlock(prev, block);
        }
        else {
            this._free = this.blockNext(block);
        }
        this.setBlockNext(block, this._used);
        this._used = block;
        if (isTop) {
            this.top = block + this.setBlockSize(block, paddedSize);
        }
        else if (this.doSplit) {
            const excess = blockSize - paddedSize;
            excess >= this.minSplit &&
                this.splitBlock(block, paddedSize, excess);
        }
        return blockDataAddress(block);
    }
    realloc(ptr, bytes) {
        if (bytes <= 0) {
            return 0;
        }
        const oldAddr = blockSelfAddress(ptr);
        let newAddr = 0;
        let block = this._used;
        let blockEnd = 0;
        while (block) {
            if (block === oldAddr) {
                [newAddr, blockEnd] = this.reallocBlock(block, bytes);
                break;
            }
            block = this.blockNext(block);
        }
        // copy old block contents to new addr
        if (newAddr && newAddr !== oldAddr) {
            this.u8.copyWithin(blockDataAddress(newAddr), blockDataAddress(oldAddr), blockEnd);
        }
        return blockDataAddress(newAddr);
    }
    reallocBlock(block, bytes) {
        const blockSize = this.blockSize(block);
        const blockEnd = block + blockSize;
        const isTop = blockEnd >= this.top;
        const paddedSize = align(bytes + SIZEOF_MEM_BLOCK, this.align);
        // shrink & possibly split existing block
        if (paddedSize <= blockSize) {
            if (this.doSplit) {
                const excess = blockSize - paddedSize;
                if (excess >= this.minSplit) {
                    this.splitBlock(block, paddedSize, excess);
                }
                else if (isTop) {
                    this.top = block + paddedSize;
                }
            }
            else if (isTop) {
                this.top = block + paddedSize;
            }
            return [block, blockEnd];
        }
        // try to enlarge block if current top
        if (isTop && block + paddedSize < this.end) {
            this.top = block + this.setBlockSize(block, paddedSize);
            return [block, blockEnd];
        }
        // fallback to free & malloc
        this.free(block);
        return [blockSelfAddress(this.malloc(bytes)), blockEnd];
    }
    reallocArray(array, num) {
        if (array.buffer !== this.buf) {
            return;
        }
        const addr = this.realloc(array.byteOffset, num * array.BYTES_PER_ELEMENT);
        return addr
            ? new array.constructor(this.buf, addr, num)
            : undefined;
    }
    free(ptrOrArray) {
        /* modified to make interface only accept pointers */
        let addr = ptrOrArray
        addr = blockSelfAddress(addr);
        let block = this._used;
        let prev = 0;
        while (block) {
            if (block === addr) {
                if (prev) {
                    this.unlinkBlock(prev, block);
                }
                else {
                    this._used = this.blockNext(block);
                }
                this.insert(block);
                this.doCompact && this.compact();
                return true;
            }
            prev = block;
            block = this.blockNext(block);
        }
        return false;
    }
    freeAll() {
        this._free = 0;
        this._used = 0;
        this.top = this.initialTop();
    }
    release() {
        delete this.u8;
        delete this.u32;
        delete this.state;
        delete this.buf;
        return true;
    }
    get align() {
        return this.state[STATE_ALIGN];
    }
    set align(x) {
        this.state[STATE_ALIGN] = x;
    }
    get end() {
        return this.state[STATE_END];
    }
    set end(x) {
        this.state[STATE_END] = x;
    }
    get top() {
        return this.state[STATE_TOP];
    }
    set top(x) {
        this.state[STATE_TOP] = x;
    }
    get _free() {
        return this.state[STATE_FREE];
    }
    set _free(block) {
        this.state[STATE_FREE] = block;
    }
    get _used() {
        return this.state[STATE_USED];
    }
    set _used(block) {
        this.state[STATE_USED] = block;
    }
    get doCompact() {
        return !!(this.state[STATE_FLAGS] & MASK_COMPACT);
    }
    set doCompact(flag) {
        flag
            ? (this.state[STATE_FLAGS] |= 1 << (MASK_COMPACT - 1))
            : (this.state[STATE_FLAGS] &= ~MASK_COMPACT);
    }
    get doSplit() {
        return !!(this.state[STATE_FLAGS] & MASK_SPLIT);
    }
    set doSplit(flag) {
        flag
            ? (this.state[STATE_FLAGS] |= 1 << (MASK_SPLIT - 1))
            : (this.state[STATE_FLAGS] &= ~MASK_SPLIT);
    }
    get minSplit() {
        return this.state[STATE_MIN_SPLIT];
    }
    set minSplit(x) {
        assert(x > SIZEOF_MEM_BLOCK, `illegal min split threshold: ${x}, require at least ${SIZEOF_MEM_BLOCK + 1}`);
        this.state[STATE_MIN_SPLIT] = x;
    }
    blockSize(block) {
        return this.u32[(block >> 2) + MEM_BLOCK_SIZE];
    }
    /**
     * Sets & returns given block size.
     *
     * @param block -
     * @param size -
     */
    setBlockSize(block, size) {
        this.u32[(block >> 2) + MEM_BLOCK_SIZE] = size;
        return size;
    }
    blockNext(block) {
        return this.u32[(block >> 2) + MEM_BLOCK_NEXT];
    }
    /**
     * Sets block next pointer to `next`. Use zero to indicate list end.
     *
     * @param block -
     */
    setBlockNext(block, next) {
        this.u32[(block >> 2) + MEM_BLOCK_NEXT] = next;
    }
    /**
     * Initializes block header with given `size` and `next` pointer. Returns `block`.
     *
     * @param block -
     * @param size -
     * @param next -
     */
    initBlock(block, size, next) {
        const idx = block >>> 2;
        this.u32[idx + MEM_BLOCK_SIZE] = size;
        this.u32[idx + MEM_BLOCK_NEXT] = next;
        return block;
    }
    unlinkBlock(prev, block) {
        this.setBlockNext(prev, this.blockNext(block));
    }
    splitBlock(block, blockSize, excess) {
        this.insert(this.initBlock(block + this.setBlockSize(block, blockSize), excess, 0));
        this.doCompact && this.compact();
    }
    initialTop(_align = this.align) {
        return (align(this.start + SIZEOF_STATE + SIZEOF_MEM_BLOCK, _align) -
            SIZEOF_MEM_BLOCK);
    }
    /**
     * Traverses free list and attempts to recursively merge blocks
     * occupying consecutive memory regions. Returns true if any blocks
     * have been merged. Only called if `compact` option is enabled.
     */
    compact() {
        let block = this._free;
        let prev = 0;
        let scan = 0;
        let scanPrev;
        let res = false;
        while (block) {
            scanPrev = block;
            scan = this.blockNext(block);
            while (scan && scanPrev + this.blockSize(scanPrev) === scan) {
                // console.log("merge:", scan.addr, scan.size);
                scanPrev = scan;
                scan = this.blockNext(scan);
            }
            if (scanPrev !== block) {
                const newSize = scanPrev - block + this.blockSize(scanPrev);
                // console.log("merged size:", newSize);
                this.setBlockSize(block, newSize);
                const next = this.blockNext(scanPrev);
                let tmp = this.blockNext(block);
                while (tmp && tmp !== next) {
                    // console.log("release:", tmp.addr);
                    const tn = this.blockNext(tmp);
                    this.setBlockNext(tmp, 0);
                    tmp = tn;
                }
                this.setBlockNext(block, next);
                res = true;
            }
            // re-adjust top if poss
            if (block + this.blockSize(block) >= this.top) {
                this.top = block;
                prev
                    ? this.unlinkBlock(prev, block)
                    : (this._free = this.blockNext(block));
            }
            prev = block;
            block = this.blockNext(block);
        }
        return res;
    }
    /**
     * Inserts given block into list of free blocks, sorted by address.
     *
     * @param block -
     */
    insert(block) {
        let ptr = this._free;
        let prev = 0;
        while (ptr) {
            if (block <= ptr)
                break;
            prev = ptr;
            ptr = this.blockNext(ptr);
        }
        if (prev) {
            this.setBlockNext(prev, block);
        }
        else {
            this._free = block;
        }
        this.setBlockNext(block, ptr);
    }
}
/**
 * Returns a block's data address, based on given alignment.
 *
 * @param blockAddress -
 */
const blockDataAddress = (blockAddress) => blockAddress > 0 ? blockAddress + SIZEOF_MEM_BLOCK : 0;
/**
 * Returns block start address for given data address and alignment.
 *
 * @param dataAddress -
 */
const blockSelfAddress = (dataAddress) => dataAddress > 0 ? dataAddress - SIZEOF_MEM_BLOCK : 0;
