export const sendEmail = async (to: string, subject: string, message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('--- Email Service (Development) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('-----------------------------------');
  }
};
