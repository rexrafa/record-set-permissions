import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs';

export class RecordSetPermissionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName = 'test.com'
    
    const vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: "rs-permission",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      cidr: "10.0.0.0/16",
      // Because we are not using the VPC, we are creating a VPC with one AZ only.
      maxAzs: 1 
   })

    const zone = new route53.PrivateHostedZone(this, 'HostedZone', {
      zoneName: domainName,
      vpc,
    });

    //Creating to IAM users to test permissions
    const user1 =  new iam.User(this, "User1", {
      userName: "user1"
    })
    const user2 =  new iam.User(this, "User2",{
      userName: "user2"
    })

    //Allow user1 to create/edit only user1 and general record sets
    user1.attachInlinePolicy(new iam.Policy(this, 'User1Policy', {
      statements: [
        new iam.PolicyStatement({
          actions: [ 'route53:ChangeResourceRecordSets' ],
          effect: iam.Effect.ALLOW,
          resources: [ zone.hostedZoneArn ],
          conditions: {
            'ForAllValues:StringEquals':{
              'route53:ChangeResourceRecordSetsNormalizedRecordNames': [`user1.${domainName}`, `general.${domainName}`]
            }
          }
        })
      ]
    }))
    //Allow user2 to create/edit only user2 and general record sets
    user2.attachInlinePolicy(new iam.Policy(this, 'User2Policy', {
      statements: [
        new iam.PolicyStatement({
          actions: [ 'route53:ChangeResourceRecordSets' ],
          effect: iam.Effect.ALLOW,
          resources: [ zone.hostedZoneArn ],
          conditions: {
            'ForAllValues:StringEquals':{
              'route53:ChangeResourceRecordSetsNormalizedRecordNames': [`user2.${domainName}`, `general.${domainName}`]
            }
          }
        })
      ]
    }))
  }
}
