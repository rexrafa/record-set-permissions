#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RecordSetPermissionsStack } from '../lib/record-set-permissions-stack';

const app = new cdk.App();
new RecordSetPermissionsStack(app, 'RecordSetPermissionsStack');
