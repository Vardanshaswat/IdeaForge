import { useState } from "react";

// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  avatar?: string;
}

const [user, setUser] = useState<User | null>(null);
