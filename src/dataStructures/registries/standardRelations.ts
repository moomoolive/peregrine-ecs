import {
    standard_entity
} from "../../entities/index"

export const enum standard_declared_relations {
    count = 50
}

export const enum standard_relation_id {
    instanceof = standard_entity.relations_start,
    wildcard = standard_entity.relations_start + 1,
}

/* fifty reserved relations for framework,
some are empty now and reserved for future
use */
export const STANDARD_RELATIONS_INDEX = [
    {
        name: "instanceof", 
        id: standard_relation_id.instanceof,
        type: "immutable"
    },
    {
        name: "wildcard", 
        id: standard_relation_id.wildcard,
        type: "immutable"
    },
    /* reserved start */
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },{
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
    {
        name: "__reserved__", 
        id: standard_entity.relations_start + 2,
        type: "immutable"
    },
] as const
