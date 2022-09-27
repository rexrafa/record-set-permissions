# Route53 Record set permissions

Recentily AWS introduced DNS resource record set permissions to [Route 53](https://aws.amazon.com/about-aws/whats-new/2022/09/amazon-route-53-support-dns-resource-record-set-permissions/?ck_subscriber_id=512838605) , enabling customers to define AWS Identity and Access Management (IAM) create, edit, and delete policies for individual or groups of DNS record sets within a Route 53 public or private hosted zone.

To be able to test this new functionality I create this CDK which creates the resource below.
- `VPC`
- `Private Hosted Zone`
- `Two IAM Users`

`User1` is allowed to add/update only to the record set user1 and general.

`User2` is allowd to add/update only to the record set user2 and general.

---

### How to test

1 - To deploy the CDK stack, execute the commands below:
```
# cdk bootstrap
# cdk synth
# cdk deploy
```

2 - After deploying the stack create an access key to user1 and user2 and configure it in your local machine.
```
# aws configure --profile user1
# aws configure --profile user2

```

3 - Testing permissions
In the root dir we have two files `user1.json` and `user2.json` which you can use to test the permissions.

`You may need to change the "Action": "CREATE" to "Action": "UPSERT", if you want to update any values after create.`

`You must have to change the --hosted-zone-id value for the Hosted Zone created by CDK.`

You shouldn't be able to apply the user2.json with the user1 and the other way around too. 
```
# aws route53 change-resource-record-sets --profile=user1 --hosted-zone-id ZXXXXXXXXXX --change-batch file://user1.json
# aws route53 change-resource-record-sets --profile=user2 --hosted-zone-id ZXXXXXXXXXX --change-batch file://user2.json
```

4 - Clean up the ENV
After you finish your tests you should delete the resource to avoid unnecessary charges.

```
# First you need to delete the record sets to be able to delete the Hosted Zone.
# Change the Action in the user1.json and user2.json to DELETE and run.

# aws route53 change-resource-record-sets --profile=user1 --hosted-zone-id ZXXXXXXXXXX --change-batch file://user1.json
# aws route53 change-resource-record-sets --profile=user2 --hosted-zone-id ZXXXXXXXXXX --change-batch file://user2.json

# cdk destroy
```


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
