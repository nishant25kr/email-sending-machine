import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleAuth(req, res) {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    const jwtToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ user, token: jwtToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
}
