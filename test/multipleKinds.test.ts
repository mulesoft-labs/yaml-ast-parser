import { assert } from "chai";
import * as YAML from '../src';
import { Schema, Type } from 'js-yaml';
import ast = require("../src/yamlAST");

/*
 * This test is specifically for the intergration into the YAML Language Server.
 * Users have been requesting that multiple custom tags types be allowed for a tag. 
 */
suite('Multiple Custom Tag Kinds ', () => {

    /*
     * Feed the custom tags and text input into the parser the same way its done
     * in the YAML Language Server.
     */
    function multipleKindsHelper(customTags: string[], textInput: string) {
        const yamlDocs = [];
        let schemaWithAdditionalTags = Schema.create(customTags.map((tag) => {
            const typeInfo = tag.split(' ');
            return new Type(typeInfo[0], { kind: typeInfo[1] || 'scalar' });
        }));

        /**
         * Collect the additional tags into a map of string to possible tag types
         */
        const tagWithAdditionalItems = new Map<string, string[]>();
        customTags.forEach(tag => {
            const typeInfo = tag.split(' ');
            const tagName = typeInfo[0];
            const tagType = (typeInfo[1] && typeInfo[1].toLowerCase()) || 'scalar';
            if (tagWithAdditionalItems.has(tagName)) {
                tagWithAdditionalItems.set(tagName, tagWithAdditionalItems.get(tagName).concat([tagType]));
            } else {
                tagWithAdditionalItems.set(tagName, [tagType]);
            }
        });

        tagWithAdditionalItems.forEach((additionalTagKinds, key) => {
            const newTagType = new Type(key, { kind: additionalTagKinds[0] || 'scalar' });
            newTagType.additionalKinds = additionalTagKinds;
            schemaWithAdditionalTags.compiledTypeMap[key] = newTagType;
        });

        let additionalOptions: YAML.LoadOptions = {
            schema: schemaWithAdditionalTags
        }
        YAML.loadAll(textInput, doc => yamlDocs.push(doc), additionalOptions);
        return yamlDocs;
    }

    function checkDocumentsForNoErrors(documents: YAML.YAMLNode[]) {
        documents.forEach(element => {
            assert.equal(element.errors.length, 0);
        });
    }

    function checkDocumentsForErrors(documents: YAML.YAMLNode[], expectedErrorCount: number) {
        let errorCount = 0;
        documents.forEach(element => {
            errorCount += element.errors.length;  
        });
        assert.equal(errorCount, expectedErrorCount);
    }
    
    test('Allow one custom tag type', function () {
        let customTags = ["!test scalar"];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForNoErrors(f);
    });

    test('Allow multiple different custom tag types', function () {
        let customTags = ["!test scalar", "!test mapping"];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForNoErrors(f);
    });

    test('Allow multiple different custom tag types with different use', function () {
        let customTags = ["!test scalar", "!test mapping"];
        const f = multipleKindsHelper(customTags, "!test\nhello: !test\n  world");
        checkDocumentsForNoErrors(f);
    });
    
    test('Allow multiple different custom tag types with multiple different uses', function () {
        let customTags = ["!test scalar", "!test mapping", "!ref sequence", "!ref mapping"];
        const f = multipleKindsHelper(customTags, "!test\nhello: !test\n  world\nsequence: !ref\n  - item1");
        checkDocumentsForNoErrors(f);
    });

    test('Error when custom tag is not available', function () {
        let customTags = [];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForErrors(f, 1);
	});

});
