"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMutator = void 0;
const idCreators_1 = require("../entities/idCreators");
class EntityMutator {
    constructor(records, tables, databuffer, tablePtrs) {
        this.records = records;
        this.tables = tables;
        this.databuffer = databuffer;
        this.$tablePtrs = tablePtrs;
    }
    createTable() {
        throw new Error("not implemented");
    }
    addTag(entityId, tagId) {
        const records = this.records;
        const entityTablePtrId = records.tablePtrIds[entityId];
        if (entityTablePtrId === -1 /* unintialized */) {
            return 1 /* entity_uninitialized */;
        }
        const tablePtr = this.$tablePtrs[entityTablePtrId];
        const table = this.tables[tablePtr];
        const tagIds = table.tagIds;
        const componentsLen = tagIds.length;
        for (let i = 0; i < componentsLen; i++) {
            /* if tag already exists on table, do nothing */
            if (tagIds[i] === tagId) {
                return 2 /* tag_exists */;
            }
        }
        /* if tag doesn't exist in current table, find it via the add edges or create it */
        let targetTable = table.addEdges.get(tagId);
        if (!targetTable) {
            targetTable = this.createTable();
            table.addEdges.set(tagId, targetTable);
        }
        /* proceed to move entity data from current table to target table, (identical components, tags + new) */
        const entityRow = records.row[entityId];
        return 0 /* successful_update */;
    }
    addRelation(entityId, relationId, relatedEntityId) {
        return this.addTag(entityId, (0, idCreators_1.relation)(relationId, relatedEntityId));
    }
    removeTag(entityId, tagId) {
        const records = this.records;
        const entityTablePtrId = records.tablePtrIds[entityId];
        if (entityTablePtrId === -1 /* unintialized */) {
            return 1 /* entity_uninitialized */;
        }
        const tablePtr = this.$tablePtrs[entityTablePtrId];
        const table = this.tables[tablePtr];
        const tagIds = table.tagIds;
        const componentsLen = tagIds.length;
        for (let i = 0; i < componentsLen; i++) {
            /* if tag exists on table, find the next table via remove edges or create it */
            if (tagIds[i] === tagId) {
                let targetTable = table.removeEdges.get(tagId);
                if (!targetTable) {
                    targetTable = this.createTable();
                    table.removeEdges.set(tagId, targetTable);
                }
                /* proceed to move entity data from current table to target table, (identical components, tags - new) */
                const entityRow = records.row[entityId];
                return 0 /* successful_update */;
            }
        }
        /* if tag does not exist on table, do nothing */
        return 3 /* tag_does_not_exist */;
    }
    removeRelation(entityId, relationId, relatedEntityId) {
        return this.removeTag(entityId, (0, idCreators_1.relation)(relationId, relatedEntityId));
    }
}
exports.EntityMutator = EntityMutator;
