
/**
 * Created by kor on 06/05/15.
 */

export {load, loadAll, safeLoad, LoadOptions} from './loader';
export {dump, safeDump} from './dumper';

import Mark=require("./mark")
export class YAMLException {

    message:string
    reason:string
    name:string
    mark:Mark

    private static CLASS_IDENTIFIER = "yaml-ast-parser.YAMLException";

    public static isInstance(instance : any) : instance is YAMLException {
        if(instance != null && instance.getClassIdentifier
            && typeof(instance.getClassIdentifier) == "function"){

            for (let currentIdentifier of instance.getClassIdentifier()){
                if(currentIdentifier == YAMLException.CLASS_IDENTIFIER) return true;
            }
        }

        return false;
    }

    public getClassIdentifier() : string[] {
        var superIdentifiers = [];

        return superIdentifiers.concat(YAMLException.CLASS_IDENTIFIER);
    }

    constructor(reason:string, mark:Mark=null) {
        this.name = 'YAMLException';
        this.reason = reason;
        this.mark = mark;
        this.message = this.toString(false);
    }

    toString(compact:boolean=false){
        var result;

        result = 'JS-YAML: ' + (this.reason || '(unknown reason)');

        if (!compact && this.mark) {
            result += ' ' + this.mark.toString();
        }

        return result;

    }
}

export * from './yamlAST'

export type Error = YAMLException

function deprecated(name) {
    return function () {
        throw new Error('Function ' + name + ' is deprecated and cannot be used.');
    };
}

export * from './scalarInference'
