import { hashPassword, comparePassword } from '../utils/password';

describe('Password Utils', () => {
  const plainPassword = 'testPassword123';

  it('should hash a password', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(plainPassword);
    expect(hashedPassword.length).toBeGreaterThan(50);
  });

  it('should compare passwords correctly', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    
    const isValid = await comparePassword(plainPassword, hashedPassword);
    expect(isValid).toBe(true);
    
    const isInvalid = await comparePassword('wrongPassword', hashedPassword);
    expect(isInvalid).toBe(false);
  });
});
