#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RecordSetPermissionsStack } from '../lib/record-set-permissions-stack';

const app = new cdk.App();
new RecordSetPermissionsStack(app, 'RecordSetPermissionsStack',{
    stackName: 'recordSetPermissions',
    env:{
        // You can change the region, which you want to deploy this stack
        region:'us-east-1' 
    }
});
