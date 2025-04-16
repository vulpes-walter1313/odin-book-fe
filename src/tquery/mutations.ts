import { BannedError, ErrorResType } from "@/lib/errors";
import { makeRequestWithAuth } from "@/lib/requests";

export const signInMutation = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${import.meta.env.VITE_BE_URL}/auth/signin`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    console.log("res", res);
    console.log("data", data);
    if (data.error.code === "BANNED") {
      throw new BannedError(
        data.error.message,
        data.error.details?.bannedUntil,
      );
    }
    throw new Error(`${data.error.message}`);
  }
  const data = await res.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return { success: true };
};

type SignUpMutationPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export async function signUpMutation({
  name,
  username,
  email,
  password,
  confirmPassword,
}: SignUpMutationPayload) {
  const res = await fetch(`${import.meta.env.VITE_BE_URL}/auth/signup`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ name, username, email, password, confirmPassword }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return { success: true };
}

export async function createPost(values: { caption: string; image: File }) {
  const formData = new FormData();
  formData.set("caption", values.caption);
  formData.set("image", values.image);
  const res = await makeRequestWithAuth(`/posts`, {
    method: "POST",
    mode: "cors",
    body: formData,
  });

  if (!res.ok) {
    const error: ErrorResType = await res.json();
    throw new Error(error.error.message);
  }
  return { success: true };
}

export async function deletePost(postId: number) {
  const res = await makeRequestWithAuth(`/posts/${postId}`, {
    method: "DELETE",
    mode: "cors",
  });
  if (!res.ok) {
    const error: ErrorResType = await res.json();
    throw new Error(error.error.message);
  }
  return { success: true };
}

export async function followMutation(username: string) {
  const res = await makeRequestWithAuth(`/profiles/${username}/follow`, {
    method: "POST",
    mode: "cors",
  });

  if (!res.ok) {
    throw new Error("Unable to Follow");
  }
  return { success: true };
}

export async function unfollowMutation(username: string) {
  const res = await makeRequestWithAuth(`/profiles/${username}/follow`, {
    method: "DELETE",
    mode: "cors",
  });

  if (!res.ok) {
    throw new Error("Unable to follow");
  }
  return { success: true };
}

export async function likePost(postId: number) {
  const res = await makeRequestWithAuth(`/posts/${postId}/likes`, {
    method: "POST",
    mode: "cors",
  });

  if (!res.ok) {
    throw new Error("Couldn't like post");
  }

  return { success: true };
}

export async function unlikePost(postId: number) {
  const res = await makeRequestWithAuth(`/posts/${postId}/likes`, {
    method: "DELETE",
    mode: "cors",
  });

  if (!res.ok) {
    throw new Error("Couldn't unlike post");
  }

  return { success: true };
}

type PostCommentPayload = {
  postId: number;
  comment: string;
};
export async function postComment({ postId, comment }: PostCommentPayload) {
  const res = await makeRequestWithAuth(`/posts/${postId}/comments`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ message: comment }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

type EditCommentPayload = {
  postId: number;
  commentId: number;
  message: string;
};
export async function editComment({
  postId,
  commentId,
  message,
}: EditCommentPayload) {
  const res = await makeRequestWithAuth(
    `/posts/${postId}/comments/${commentId}`,
    {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify({ message: message }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

export async function deleteComment(postId: number, commentId: number) {
  const res = await makeRequestWithAuth(
    `/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      mode: "cors",
    },
  );

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

export async function likeComment(postId: number, commentId: number) {
  const res = await makeRequestWithAuth(
    `/posts/${postId}/comments/${commentId}/like`,
    {
      method: "POST",
      mode: "cors",
    },
  );

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }

  const data = await res.json();
  return data;
}

export async function unlikeComment(postId: number, commentId: number) {
  const res = await makeRequestWithAuth(
    `/posts/${postId}/comments/${commentId}/like`,
    {
      method: "DELETE",
      mode: "cors",
    },
  );

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }

  const data = await res.json();
  return data;
}

export type EditProfileInfoPayload = {
  name: string;
  bio?: string;
  profileImg?: File;
};
export async function editProfileInfo({
  name,
  bio,
  profileImg,
}: EditProfileInfoPayload) {
  // create a formDAta object to upload file here too
  const formData = new FormData();
  formData.set("name", name);
  if (bio) {
    formData.set("bio", bio);
  }
  if (profileImg) {
    formData.set("profileImg", profileImg);
  }

  const res = await makeRequestWithAuth("/account/user", {
    method: "PUT",
    mode: "cors",
    body: formData,
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

type UpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
export async function updatePassword(values: UpdatePasswordPayload) {
  const res = await makeRequestWithAuth("/account/password", {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

type UpdateUsernamePayload = {
  newUsername: string;
};
export async function updateUsername(values: UpdateUsernamePayload) {
  const res = await makeRequestWithAuth(`/account/username`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

type DeleteAccountPayload = {
  password: string;
};
export async function deleteAccount(values: DeleteAccountPayload) {
  const res = await makeRequestWithAuth(`/account/user`, {
    method: "DELETE",
    mode: "cors",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

type DeleteUserPayload = {
  username: string;
};
export async function deleteUser({ username }: DeleteUserPayload) {
  const res = await makeRequestWithAuth(`/admin/users/${username}`, {
    method: "DELETE",
    mode: "cors",
  });
  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

type BanUserPayload = {
  username: string;
  banUntil: string;
};
export async function banUser(values: BanUserPayload) {
  const res = await makeRequestWithAuth("/admin/users/ban", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}
