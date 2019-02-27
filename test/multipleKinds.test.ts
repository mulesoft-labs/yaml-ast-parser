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

        //We need compiledTypeMap to be available from schemaWithAdditionalTags before we add the new custom properties
        customTags.map((tag) => {
            const typeInfo = tag.split(' ');
            const t = new Type(typeInfo[0], { kind: typeInfo[1] || 'scalar' });
            t.additionalKinds = ["scalar"];
            schemaWithAdditionalTags.compiledTypeMap[typeInfo[0]] = t;
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

	test('Allow multiple different custom tag types', function () {
        let customTags = ["!test scalar", "!test mapping"];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForNoErrors(f);
    });
    
    test('Allow one custom tag type', function () {
        let customTags = ["!test scalar"];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForNoErrors(f);
    });
    
    test('Error when custom tag is not available', function () {
        let customTags = [];
        const f = multipleKindsHelper(customTags, "!test");
        checkDocumentsForErrors(f, 1);
	});

});
