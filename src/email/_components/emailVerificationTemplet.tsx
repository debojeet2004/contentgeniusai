import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const EmailVerification = ({ name, url }: { name: string; url: string }) => (
  <Html lang="en" dir="ltr">
    <Tailwind>
      <Head />
      <Body className="bg-gray-100 font-sans py-[40px]">
        <Preview>Verify your email address to complete your account setup</Preview>
        
        <Container className="mx-auto bg-white rounded-[12px] shadow-lg max-w-[600px] overflow-hidden">
          {/* Header with solid background */}
          <Section className="bg-blue-200 px-[40px] py-[32px] text-center">
            <Text className="text-black text-[28px] font-bold m-0 leading-[32px]">
              🔐 Email Verification
            </Text>
            <Text className="text-gray-700 text-[16px] m-0 mt-[8px]">
              Secure your account in one click
            </Text>
          </Section>

          {/* Main content */}
          <Section className="px-[40px] py-[32px]">
            <Text className="text-black text-[20px] font-semibold m-0 mb-[16px]">
              Hi {name}! 👋
            </Text>
            
            <Text className="text-gray-800 text-[16px] leading-[24px] m-0 mb-[24px]">
              Welcome aboard! We&apos;re excited to have you join us. To get started and ensure the security of your account, please verify your email address.
            </Text>

            {/* CTA Button */}
            <Section className="text-center my-[32px] border-2 p-2 px-6 border-black">
              <Link
                href={url}
                className="bg-blue-400 text-black text-[16px] font-semibold no-underline rounded-[8px] px-[32px] py-[14px] inline-block shadow-lg hover:shadow-xl transition-all box-border"
              >
                ✅ Verify My Email Address
              </Link>
            </Section>

            {/* Security notice */}
            <Section className="bg-yellow-50 border-l-[4px] border-yellow-400 p-[16px] rounded-[6px] mb-[24px]">
              <Text className="text-black text-[14px] m-0 font-medium">
                ⚡ Quick reminder: This verification link expires in 24 hours for your security.
              </Text>
            </Section>

            {/* Alternative link */}
            <Text className="text-black text-[14px] leading-[20px] m-0 mb-[8px]">
              Having trouble with the button? Copy and paste this link into your browser:
            </Text>
            
            <Section className="bg-gray-50 p-[16px] rounded-[6px] border border-gray-200">
              <Link
                href={url}
                className="text-blue-600 text-[14px] break-all hover:text-blue-800"
              >
                {url}
              </Link>
            </Section>

            {/* Help text */}
            <Text className="text-black text-[14px] leading-[20px] m-0 mt-[24px] text-center">
              If you didn&apos;t create an account with us, you can safely ignore this email. No further action is required.
            </Text>
          </Section>

          {/* Footer */}
          <Section className="bg-gray-200 px-[40px] py-[24px] border-t border-gray-200">
            <Text className="text-black text-[12px] text-center m-0">
              This is an automated security message from our system.
            </Text>
            <Text className="text-gray-600 text-[11px] text-center m-0 mt-[8px]">
              © {new Date().getFullYear()} Agentic Media Agency. All rights reserved.
              <br />
              {/* 123 Business Street, Suite 100, City, State 12345 */}
              <br />
              {/* <Link href="#" className="text-gray-600 hover:text-black">Unsubscribe</Link> */}
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailVerification;