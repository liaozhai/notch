"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const core_1 = require("@mikro-orm/core");
const Edition_1 = require("./Edition");
exports.Publisher = (0, core_1.defineEntity)({
    name: "Publisher",
    properties: {
        id: core_1.p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        name: core_1.p.text(),
        editions: () => core_1.p.oneToMany(Edition_1.Edition).mappedBy("publisher"),
    },
});
//# sourceMappingURL=Publisher.js.map