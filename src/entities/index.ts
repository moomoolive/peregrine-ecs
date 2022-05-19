export {EntityRecords, record_encoding} from "./records"

export const enum component_entity_encoding {
    /* right now max count is lower than future reserved 
    max count, because components take a lot of RAM right now. 
    Hopefully in the future this will change */
    future_reserved_max_count = 512, /* 9 bits */
    max_count = 256 /* 8 bits */
}

export const enum reserved_by_ecs_encoding {
    max_count = 50,
}

export const enum relation_entity_encoding {
    future_reserved_max_id = 4096 - 1, /* 12 bits */
    max_id = 2048 - 1, /* 11 bits */
    max_count = (
        max_id
        - reserved_by_ecs_encoding.max_count
        - component_entity_encoding.future_reserved_max_count
    ),
    approx_max_count = 1_400,
    relationship_flag = 1 << 31 /* the last bit of an id indicates whether it's a relationship ship (relation + entity) */
}

export const enum standard_entity {
    reserved_start = 0,
    reserved_end = (
        reserved_by_ecs_encoding.max_count 
        - reserved_start
    ),
    reserved_count = reserved_end - reserved_start,

    components_start = reserved_end,
    components_end = (
        components_start 
        + component_entity_encoding.future_reserved_max_count
    ),

    relations_start = components_end,
    relations_end = relation_entity_encoding.future_reserved_max_id,
    start_of_user_defined_entities = relations_end, 

    /* reserved entity ids */
    ecs_id = 0, /* the base id, any entity in the ecs has this component */
    ecs_component = 1, /* refers to components defined by users */
    ecs_root = 2, /* any user defined entity starts here */
}

export const STANDARD_ENTITIES = [
    standard_entity.ecs_id,
    standard_entity.ecs_component,
] as const

export const enum entities_encoding {
    /* actual entity limit is 524,287 (19 bits), 
    but this number is easier to remember */
    limit = 500_000,
    true_limit = (1 << 19) - 1,
    /* actual entity minimum is 4,096 (12 bits), 
    but this number is easier to remember */
    minimum = 5_000,
}
