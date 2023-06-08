"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const my_controller_1 = __importDefault(require("./my-controller"));
const setting_1 = __importDefault(require("./setting"));
const track_1 = __importDefault(require("./track"));
exports.default = {
    myController: my_controller_1.default,
    setting: setting_1.default,
    track: track_1.default,
};
