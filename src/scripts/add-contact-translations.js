const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');

// Contact translations
const koContact = {
  title: '문의하기',
  name: '이름',
  email: '이메일',
  subject: '제목 (선택)',
  message: '문의 내용',
  send: '전송하기',
  sending: '전송 중...',
  success: '메시지가 전송되었습니다! 감사합니다.',
  error: '전송에 실패했습니다. 다시 시도해주세요.',
  namePlaceholder: '이름을 입력하세요',
  emailPlaceholder: '이메일을 입력하세요',
  subjectPlaceholder: '제목을 입력하세요',
  messagePlaceholder: '문의 내용을 입력하세요',
};

const enContact = {
  title: 'Contact Us',
  name: 'Name',
  email: 'Email',
  subject: 'Subject (optional)',
  message: 'Message',
  send: 'Send Message',
  sending: 'Sending...',
  success: 'Message sent successfully! Thank you.',
  error: 'Failed to send. Please try again.',
  namePlaceholder: 'Enter your name',
  emailPlaceholder: 'Enter your email',
  subjectPlaceholder: 'Enter subject',
  messagePlaceholder: 'Enter your message',
};

const deContact = {
  title: 'Kontakt',
  name: 'Name',
  email: 'E-Mail',
  subject: 'Betreff (optional)',
  message: 'Nachricht',
  send: 'Nachricht senden',
  sending: 'Wird gesendet...',
  success: 'Nachricht erfolgreich gesendet! Danke.',
  error: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
  namePlaceholder: 'Namen eingeben',
  emailPlaceholder: 'E-Mail eingeben',
  subjectPlaceholder: 'Betreff eingeben',
  messagePlaceholder: 'Nachricht eingeben',
};

['ko', 'en', 'de'].forEach((locale) => {
  const filePath = path.join(root, 'messages', locale + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.Contact = locale === 'ko' ? koContact : locale === 'en' ? enContact : deContact;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(locale + ' Contact added:', JSON.stringify(data.Contact.title));
});
