"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const createClient = (url, key) => {
    return (0, supabase_js_1.createClient)(url, key);
};
exports.createClient = createClient;
