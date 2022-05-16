import {expect, describe, it} from "@jest/globals"
import {componentViewMacro} from "./index"

describe("component generation", () => {
    it("components are generated with correct key names and data types", () => {
        const {
            View,
            componentSegements,
            bytesPerElement,
            bytesPerField,
            memoryConstructor,
            tokens,
            id,
            name
        } = componentViewMacro(0, "position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        expect(name).toBe("position")
        expect(id).toBe(0)
        expect(componentSegements).toBe(3)
        expect(bytesPerField).toBe(8)
        expect(bytesPerElement).toBe(24)
        expect(memoryConstructor).toBe(Float64Array)
        expect(tokens.memoryType).toBe("f64")
        expect(tokens.fields).toEqual([
            {name: "x", databufferOffset: 0, originalDatabufferOffset: 0},
            {name: "y", databufferOffset: 1, originalDatabufferOffset: 1},
            {name: "z", databufferOffset: 2, originalDatabufferOffset: 2},
        ])

        const databuffer = new memoryConstructor(5 * componentSegements)
        const pos = new View({databuffer})
        expect(typeof pos.x).toBe("function")
        expect(typeof pos.set_x).toBe("function")
        expect(typeof pos.y).toBe("function")
        expect(typeof pos.set_y).toBe("function")
        expect(typeof pos.z).toBe("function")
        expect(typeof pos.set_z).toBe("function")
        
        pos.set_x(3, 10.2)
        expect(pos.x(3)).toBe(10.2)
        pos.set_y(1, 5.0)
        expect(pos.y(1)).toBe(5.0)
        pos.set_z(0, 350_230.33)
        expect(pos.z(0)).toBe(350_230.33)
        {
        const {
            View,
            componentSegements,
            bytesPerElement,
            bytesPerField,
            memoryConstructor,
            tokens,
            id,
            name
        } = componentViewMacro(1, "animation", {
            position: "i32",
            face: "i32"
        })
        expect(name).toBe("animation")
        expect(id).toBe(1)
        expect(componentSegements).toBe(2)
        expect(bytesPerField).toBe(4)
        expect(bytesPerElement).toBe(8)
        expect(memoryConstructor).toBe(Int32Array)
        expect(tokens.memoryType).toBe("i32")
        /* fields are sorted alphabetically by name */
        expect(tokens.fields).toEqual([
            {
                name: "face", 
                databufferOffset: 0,
                originalDatabufferOffset: 1
            },
            {
                name: "position", 
                databufferOffset: 1,
                originalDatabufferOffset: 0
            },
        ])

        const databuffer = new memoryConstructor(componentSegements * 5)
        const anim = new View({databuffer})
        expect(typeof anim.position).toBe("function")
        expect(typeof anim.set_position).toBe("function")
        expect(typeof anim.face).toBe("function")
        expect(typeof anim.set_face).toBe("function")

        anim.set_face(0, 2)
        expect(anim.face(0)).toBe(2)
        anim.set_face(3, 1_000)
        expect(anim.face(3)).toBe(1_000)
        anim.set_position(1, 5)
        expect(anim.position(1)).toBe(5)
        }
    })
})
