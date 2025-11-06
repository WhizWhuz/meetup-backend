const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Ogiltig mejladress"),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
  name: z.string().min(1, "Namn får inte vara tomt").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Ogiltig mejladress"),
  password: z.string().min(1, "Lösenord krävs"),
});

module.exports = { registerSchema, loginSchema };
