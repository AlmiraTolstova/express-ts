import express, { Request, Response } from "express";
import {
  IUpdateUserDto,
  IUser,
  ICreateUserDto,
  IPartialUpdateUserDto,
  IChangeEmailDto,
} from "./types/user.types";

// ======================== TYPES ==============================
// export interface IResponseBody {
//   success: boolean;
//   data?: IUser;
//   error?: string;
//   message?: string;
// }

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ====================== DATABASE ================================
const users: IUser[] = [
  { id: 1, name: "Alice", email: "alice@gd.com" },
  { id: 2, name: "Dima", email: "dima@gd.com" },
];

// ======================= SERVER =============================
const app = express();
app.use(express.json());

// ===================== GET /api/users =========================
app.get("/api/users", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: users,
    count: users.length,
  });
});

// ===================== POST /api/users =========================
app.post(
  "/api/users",
  (req: Request<{}, {}, ICreateUserDto>, res: Response<ApiResponse<IUser>>) => {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({
        success: false,
        error: "All fileds are required",
      });
      return;
    }

    if (users.some((user) => user.email === email)) {
      res.status(400).json({
        success: false,
        error: "User with such email was already been registred",
      });
      return;
    }

    const newUser: IUser = {
      id: users.length,
      name,
      email,
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "Successfully registred",
    });
  },
);

// ===================== PUT /api/users/:id =========================
app.put(
  "/api/users/:id",
  (
    req: Request<{ id: string }, {}, IUpdateUserDto>,
    res: Response<ApiResponse<IUser>>,
  ) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const emailExists = users.some((u) => u.email === email && u.id !== id);

    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    user.name = name;
    user.email = email;

    return res.json({
      success: true,
      data: user,
      message: "User fully updated",
    });
  },
);

// ===================== PATCH /api/users/:id =========================
app.patch(
  "/api/users/:id",
  (
    req: Request<{ id: string }, {}, IPartialUpdateUserDto>,
    res: Response<ApiResponse<IUser>>,
  ) => {
    const id = Number(req.params.id);

    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const { name, email } = req.body;

    if (email) {
      const emailExists = users.some((u) => u.email === email && u.id !== id);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
        });
      }
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    return res.json({
      success: true,
      data: user,
      message: "User partially updated",
    });
  },
);

// ===================== DELETE /api/users/:id =========================
app.delete(
  "/api/users/:id",
  (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<{ deletedId: number }>>,
  ) => {
    const id = Number(req.params.id);

    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    users.splice(index, 1);

    return res.json({
      success: true,
      data: {
        deletedId: id,
      },
      message: "User deleted",
    });
  },
);

// ===================== POST /api/users/:id/change-email =========================
app.post(
  "/api/users/:id/change-email",
  (
    req: Request<{ id: string }, {}, IChangeEmailDto>,
    res: Response<ApiResponse<IUser>>,
  ) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const { newEmail, confirmEmail } = req.body;

    if (newEmail !== confirmEmail) {
      return res.status(400).json({
        success: false,
        error: "Emails do not match",
      });
    }

    const emailExists = users.some((u) => u.email === newEmail && u.id !== id);

    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    user.email = newEmail;
    return res.json({
      success: true,
      data: user,
      message: "Email changed successfully",
    });
  },
);

app.listen(3333, () => {
  console.log(`TS Server is running at http://127.0.0.1:3333`);
});
