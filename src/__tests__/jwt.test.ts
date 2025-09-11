import { generateToken, verifyToken } from '../utils/jwt';

describe('JWT Utils', () => {
  const payload = {
    id: 'user123',
    email: 'test@example.com',
  };

  it('should generate a token', () => {
    const token = generateToken(payload);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should verify a token', () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid.token.here');
    }).toThrow();
  });
});
