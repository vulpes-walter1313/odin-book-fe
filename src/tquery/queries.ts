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
