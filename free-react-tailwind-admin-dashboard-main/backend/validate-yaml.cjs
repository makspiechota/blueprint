#!/usr/bin/env node

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

if (process.argv.length < 4) {
  console.log('Usage: node validate-yaml.js <yaml-file> <schema-file>');
  process.exit(1);
}

const yamlFile = process.argv[2];
const schemaFile = process.argv[3];

try {
  // Load and validate YAML syntax
  const yamlContent = fs.readFileSync(yamlFile, 'utf8');
  const data = yaml.load(yamlContent);
  console.log('✅ Valid YAML syntax');

   // Load schema
   const schemaContent = fs.readFileSync(schemaFile, 'utf8');
   const schema = yaml.load(schemaContent);
   console.log('✅ Valid schema syntax');

   const jsonSchemaFile = schemaFile.replace('.yaml', '.json');
   let useAjv = false;
   let ajvValidate;
   if (fs.existsSync(jsonSchemaFile)) {
     const jsonSchemaContent = fs.readFileSync(jsonSchemaFile, 'utf8');
     const jsonSchema = JSON.parse(jsonSchemaContent);
     const ajv = new Ajv();
     ajvValidate = ajv.compile(jsonSchema);
     useAjv = true;
     console.log('✅ Using AJV for validation');
   } else {
     console.log('✅ Using custom validation');
   }

   // Validate structure
   if (useAjv) {
     const valid = ajvValidate(data);
     if (!valid) {
       console.log('❌ AJV validation failed');
       ajvValidate.errors.forEach(error => {
         console.log(`- ${error.instancePath}: ${error.message}`);
       });
       console.log('❌ Structure validation failed');
       process.exit(1);
     } else {
       console.log('✅ Structure validation passed');
     }
   } else {
     console.log('Data keys:', Object.keys(data));
     console.log('Schema keys:', Object.keys(schema));
   function validateStructure(obj, sch, currentPath = '') {
     let valid = true;
     for (const key in sch) {
       const isOptional = key.endsWith('?');
       const actualKey = isOptional ? key.slice(0, -1) : key;
       const fullPath = currentPath ? `${currentPath}.${actualKey}` : actualKey;
       if (!(actualKey in obj)) {
         if (!isOptional) {
           console.log(`❌ Missing key: ${fullPath}`);
           valid = false;
         }
       } else {
        const schemaValue = sch[key];
        const objValue = obj[key];

         if (typeof schemaValue === 'string') {
           if (['string', 'number', 'boolean'].includes(schemaValue)) {
             // Type check
             if (typeof objValue !== schemaValue) {
               console.log(`❌ Expected ${schemaValue} at: ${fullPath}, got ${typeof objValue}`);
               valid = false;
             }
           } else {
             // Fixed value check
             if (objValue !== schemaValue) {
               console.log(`❌ Expected value ${schemaValue} at: ${fullPath}, got ${objValue}`);
               valid = false;
             }
           }
         } else if (typeof schemaValue === 'object' && schemaValue !== null && !Array.isArray(schemaValue)) {
           // Nested object
           if (typeof objValue === 'object' && objValue !== null) {
             // If schema is empty object {}, allow any structure without validation
             if (Object.keys(schemaValue).length > 0) {
               if (!validateStructure(objValue, schemaValue, fullPath)) {
                 valid = false;
               }
             }
           } else {
             console.log(`❌ Expected object at: ${fullPath}, got ${typeof objValue}`);
             valid = false;
           }
         } else if (Array.isArray(schemaValue)) {
           // Array
           if (!Array.isArray(objValue)) {
             console.log(`❌ Expected array at: ${fullPath}, got ${typeof objValue}`);
             valid = false;
           } else {
             // Validate each item if schema specifies item type
             if (schemaValue.length === 1 && typeof schemaValue[0] === 'string') {
               const expectedType = schemaValue[0];
               objValue.forEach((item, index) => {
                 if (typeof item !== expectedType) {
                   console.log(`❌ Expected ${expectedType} at: ${fullPath}[${index}], got ${typeof item}`);
                   valid = false;
                 }
               });
             }
           }
         }
      }
    }
    return valid;
  }

  if (useAjv) {
    const valid = ajvValidate(data);
    if (!valid) {
      console.log('❌ AJV validation failed');
      ajvValidate.errors.forEach(error => {
        console.log(`- ${error.instancePath}: ${error.message}`);
      });
      console.log('❌ Structure validation failed');
      process.exit(1);
    } else {
      console.log('✅ Structure validation passed');
    }
  } else {
    if (validateStructure(data, schema)) {
      console.log('✅ Structure validation passed');
    } else {
      console.log('❌ Structure validation failed');
      process.exit(1);
    }
  }
}

} catch (error) {
  console.log('❌ Error:', error.message);
  process.exit(1);
}