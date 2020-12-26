import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

// AWS sdk is configured by environment variables

let transporter = nodemailer.createTransport({
  SES: new aws.SES({
      apiVersion: '2010-12-01',
  })
});

export default transporter;