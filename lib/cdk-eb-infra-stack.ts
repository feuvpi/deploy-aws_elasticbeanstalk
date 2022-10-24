import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import iam = require('@aws-cdk/aws-iam')

//dependencia do aws-s3-assets instalada atraves do npm:
import s3assets = require('@aws-cdk/aws-s3-assets');

// -- adicionando dependencia do Elasticbeanstalk
import elasticbeanstalk = require('@aws-cdk/aws-elasticbeanstalk');



// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkEbInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

 
    // Construir um S3 asset do arquivo ZIP localizada na raiz da aplicação (directory up)
    const webAppZipArchive = new s3assets.Asset(this, 'WebAppZip', {
      path: `${__dirname}/../app.zip`,
    });


    // -- create Elastic Beanstalk app
    const appName = 'MyWebApp';
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName,
    })



    // -- create an app version from the s3 asset defined earlier
    const appVersionProps = new elasticbeanstalk.CfnApplication(this, 'AppVersion', {
      applicationName: appName,
      sourceBundle: {
        s3Bucket: webAppZipArchive.s3BucketName,
        s3Key: webAppZipArchive.s3ObjectKey,
      },
    })

        // -- make sure that Elastic Beanstalk app exists before creating an app version
        appVersionProps.addDependsOn(app);




    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkEbInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });


    /*Uma pilha de recursos é um conjunto de recursos da infraestrutura em nuvem que serão provisionados em uma conta especifica. 
    
    - S3Assets: ajuda a carregar a aplicação compactada no S3 e permite que a aplicação do CDK acesse o local do projeto.
    - Aplicação do Elastic Beanstalk: é uma coleção logica de componentes do Elastic Beanstalk, com componentes, versões e configurações de ambientes.
    - Versão da aplicação do Elastic Beanstalk: refere-se a uma iteração especifica e rotulada do codigo implantavel de uma aplicação Web. A versão da aplicação aponta para o Amazon Simple Storage Service (Amazon S3) o objeto que contem o codigo implantavel (no caso aqui, o arquivo ZIP que sera carregado no S3 com o S3 Assets). As aplicações podem ter varias versões, e cada uma é unica.
    - Perfil de instancia e role: é um container para uma AWS identity and Access Management (IAM) role que pode ser usada para transferir informações da role para uma instancia Amazon EC2 quando ela for iniciada.
    - Ambiente do Elastic Beanstalk: é uma coleção de recursos da AWS que executam uma versão da aplicação. Cada ambiente executa apenas uma versão da aplicação por vez.

    
    
    */
  }
}
