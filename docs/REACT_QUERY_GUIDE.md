# React Query 사용 가이드

이 프로젝트는 **TanStack React Query v5**를 사용하여 서버 상태를 관리합니다.

## 📚 목차

1. [현재 구현 상태](#현재-구현-상태)
2. [사용 방법](#사용-방법)
3. [API 연동 예시](#api-연동-예시)
4. [Query Keys 관리](#query-keys-관리)
5. [최적화 설정](#최적화-설정)

## 현재 구현 상태

### ✅ 구현 완료

- **Auth 페이지**: 회원가입, 로그인, 이메일 중복 확인
- **Query Client 설정**: 전역 설정 최적화 완료
- **공통 훅**: `src/lib/queries.ts`에 재사용 가능한 훅 정의

### 🔄 준비 완료 (API 연동 대기)

- **Posts 페이지**: `usePostsQuery`, `useUpdatePostMutation`
- **Profile 페이지**: `useProfileQuery`, `useUpdateProfileMutation`
- **Admin 페이지**: 문의 관리 관련 훅

## 사용 방법

### 1. Query (데이터 조회)

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get("/api/posts").json(),
    staleTime: 1 * 60 * 1000, // 1분
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{JSON.stringify(data)}</div>;
};
```

### 2. Mutation (데이터 변경)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const MyComponent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/api/posts", { json: data }).json(),
    onSuccess: () => {
      // 캐시 무효화 (자동 재조회)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "성공", description: "게시글이 생성되었습니다." });
    },
    onError: (error) => {
      toast({
        title: "실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ title: "제목", content: "내용" })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "생성 중..." : "생성하기"}
    </button>
  );
};
```

### 3. 공통 훅 사용 (권장)

`src/lib/queries.ts`에 정의된 훅을 사용하면 더 간단합니다:

```typescript
import { useSignupMutation } from "@/lib/queries";

const SignupForm = () => {
  const signupMutation = useSignupMutation();

  const handleSubmit = async (data) => {
    try {
      await signupMutation.mutateAsync(data);
      // 성공 처리 (토스트는 자동으로 표시됨)
    } catch (error) {
      // 에러 처리 (토스트는 자동으로 표시됨)
    }
  };

  return (
    <button onClick={handleSubmit} disabled={signupMutation.isPending}>
      {signupMutation.isPending ? "회원가입 중..." : "회원가입"}
    </button>
  );
};
```

## API 연동 예시

### Posts 페이지 연동

현재 `Posts.tsx`는 클라이언트 상태로만 관리됩니다. API 연동 시:

```typescript
// src/pages/Posts.tsx
import { usePostsQuery, useUpdatePostMutation } from "@/lib/queries";

const Posts = () => {
  // 1. 주석 제거
  const { data: posts, isLoading } = usePostsQuery();
  const updateMutation = useUpdatePostMutation();

  // 2. 로컬 상태 제거
  // const [posts, setPosts] = useState(mockPosts); // 삭제

  // 3. 수정 핸들러 변경
  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: editingPost.id,
        title: title.trim(),
        content: markdown,
      });
      setOpen(false);
    } catch (error) {
      // 에러는 mutation에서 처리
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    // ... UI
  );
};
```

### Profile 페이지 연동

```typescript
// src/pages/Profile.tsx
import { useProfileQuery, useUpdateProfileMutation } from "@/lib/queries";

const Profile = () => {
  const { data: profile, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  // 프로필 데이터로 초기화
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setDepartment(profile.department);
    }
  }, [profile]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ name, email, department });
    } catch (error) {
      // 에러는 mutation에서 처리
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    // ... UI
  );
};
```

## Query Keys 관리

Query Key는 `src/lib/queries.ts`에 중앙 관리됩니다:

```typescript
export const queryKeys = {
  auth: {
    user: ["auth", "user"] as const,
    emailCheck: (email: string) => ["auth", "email-check", email] as const,
  },
  posts: {
    all: ["posts"] as const,
    detail: (id: string) => ["posts", id] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
  },
};

// 사용 예시
queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
```

## 최적화 설정

### 전역 설정 (src/App.tsx)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1분 - 데이터 신선도
      gcTime: 5 * 60 * 1000, // 5분 - 캐시 유지 시간
      retry: 1, // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 포커스 시 재요청 비활성화
      refetchOnReconnect: true, // 재연결 시 재요청
    },
    mutations: {
      retry: 0, // Mutation은 재시도 안 함
    },
  },
});
```

### 개별 Query 설정

특정 Query만 다르게 설정하려면:

```typescript
useQuery({
  queryKey: ["important-data"],
  queryFn: fetchImportantData,
  staleTime: 10 * 60 * 1000, // 10분 (전역 설정 무시)
  gcTime: 30 * 60 * 1000, // 30분
  refetchOnWindowFocus: true, // 이 Query만 포커스 시 재요청
});
```

## 주요 개념

### staleTime vs gcTime

- **staleTime**: 데이터가 "신선한" 상태로 유지되는 시간

  - 이 시간 동안은 같은 Query를 다시 호출해도 네트워크 요청 없이 캐시 반환
  - 기본값: 0 (즉시 stale)

- **gcTime** (구 cacheTime): 캐시가 메모리에 유지되는 시간
  - 사용되지 않는 캐시가 가비지 컬렉션되기 전까지의 시간
  - 기본값: 5분

### 캐시 무효화

데이터를 변경한 후 관련 Query를 다시 불러오려면:

```typescript
// 특정 Query 무효화
queryClient.invalidateQueries({ queryKey: ["posts"] });

// 특정 Query만 정확히 무효화
queryClient.invalidateQueries({ queryKey: ["posts", "1"], exact: true });

// 모든 posts 관련 Query 무효화
queryClient.invalidateQueries({ queryKey: ["posts"] });
```

## 디버깅

React Query DevTools를 추가하면 캐시 상태를 시각적으로 확인할 수 있습니다:

```bash
npm install @tanstack/react-query-devtools
```

```typescript
// src/App.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* ... */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

## 참고 자료

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [React Query v5 마이그레이션 가이드](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
