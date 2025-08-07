import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  resData = 
  const { access_token: token, expires_in = 60 * 60 * 24 * 7 } = data
  res.setHeader('Set-Cookie', serialize('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expires_in,
    path: '/',
  }));
  // ...
};