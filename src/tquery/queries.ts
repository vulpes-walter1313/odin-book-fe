import { ErrorResType } from "@/lib/errors";
import { makeRequestWithAuth } from "@/lib/requests";

export const getAuthCheck = async () => {
  console.log("getAuthCheck hit");
  const res = await makeRequestWithAuth("/auth/check", {
    mode: "cors",
    method: "GET",
  });
  console.log("res returned from makeRequestWithAuth");

  if (!res.ok) {
    console.log("res.ok = false");
    throw new Error("Unauthenticated");
  }
  const data = await res.json();
  if (data.success) {
    console.log("sending data back");
    return data;
  } else {
    console.log("return data not successful...");
    throw new Error("Error in auth check");
  }
};

export const getUserExplore = async (page: number, search?: string) => {
  // TODO: fetch users from BE
  const res = await makeRequestWithAuth(
    `/profiles?page=${page}${search ? `&search=${search}` : ""}`,
    {
      method: "GET",
      mode: "cors",
    },
  );
  if (!res.ok) {
    throw new Error("Error fetching users");
  }
  const data = await res.json();
  return data;
};

type GetFeedPostsPayload = {
  sort: "popular" | "latest" | "oldest";
  page: number;
};
export async function getFeedPosts({ sort, page }: GetFeedPostsPayload) {
  const res = await makeRequestWithAuth(
    `/posts?feed=personal&sort=${sort}&page=${page}`,
    {
      method: "GET",
      mode: "cors",
    },
  );

  if (!res.ok) {
    throw new Error("Error fetching from personal feed");
  }
  const data = await res.json();
  return data;
}

type GetExplorePostsPayload = {
  sort: "popular" | "latest" | "oldest";
  page: number;
};
export async function getExplorePosts({ sort, page }: GetExplorePostsPayload) {
  const res = await makeRequestWithAuth(
    `/posts?feed=explore&sort=${sort}&page=${page}`,
    {
      method: "GET",
      mode: "cors",
    },
  );

  if (!res.ok) {
    throw new Error("Error fetching from explore feed");
  }
  const data = await res.json();
  return data;
}

type GetLikedPostsPayload = {
  sort: "popular" | "latest" | "oldest";
  page: number;
};
export async function getLikedPosts({ sort, page }: GetLikedPostsPayload) {
  const res = await makeRequestWithAuth(
    `/posts?feed=liked&sort=${sort}&page=${page}`,
    {
      method: "GET",
      mode: "cors",
    },
  );

  if (!res.ok) {
    throw new Error("Error fetching from likes page");
  }
  const data = await res.json();
  return data;
}

type GetPostCommentsPayload = {
  postId: number;
  page: number;
};
export async function getPostComments({
  postId,
  page,
}: GetPostCommentsPayload) {
  const res = await makeRequestWithAuth(
    `/posts/${postId}/comments?page=${page}`,
    {
      method: "GET",
      mode: "cors",
    },
  );
  if (!res.ok) {
    throw new Error("Couldn't get post comments");
  }
  const data = await res.json();
  return data;
}

export async function getUserProfile(username: string | undefined) {
  if (!username) {
    throw new Error("username is undefined");
  }
  const res = await makeRequestWithAuth(`/profiles/${username}`, {
    method: "GET",
    mode: "cors",
  });

  if (!res.ok) {
    const data: ErrorResType = await res.json();
    throw new Error(data.error.message);
  }
  const data = await res.json();
  return data;
}

export async function getUserFollowing(
  username: string | undefined,
  page: number,
) {
  if (!username) {
    throw new Error("username is undefined");
  }
  const res = await makeRequestWithAuth(
    `/profiles/${username}/following?page=${page}&limit=15`,
    {
      method: "GET",
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

export async function getUserFollowers(
  username: string | undefined,
  page: number,
) {
  if (!username) {
    throw new Error("username is undefined");
  }
  const res = await makeRequestWithAuth(
    `/profiles/${username}/followers?page=${page}&limit=15`,
    {
      method: "GET",
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

type GetUserPostsPayload = {
  username: string | undefined;
  page: number;
  sort: "popular" | "latest" | "oldest";
};
export async function getUserPosts({
  username,
  page,
  sort,
}: GetUserPostsPayload) {
  if (!username) {
    throw new Error("username is undefined");
  }
  const res = await makeRequestWithAuth(
    `/posts?feed=user&sort=${sort}&page=${page}&username=${username}`,
    {
      method: "GET",
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
