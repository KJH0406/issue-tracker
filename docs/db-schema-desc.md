# Prisma DB Schema Description

    이 문서는 Prisma 기반 데이터 모델과 관계 구조를 설명하는 문서입니다.

---

## 1. 유저 모델

```prisma
model User {
  id        String           @id @default(uuid())
  email     String           @unique
  username  String
  password  String
  createdAt DateTime         @default(now())

  workspaces WorkspaceUser[] // 사용자 → 공간 연결 (다대다 관계)
}
```

- 기본 정보: email, username, password
- `workspaces`는 유저가 속한 공간 목록 확인용 관계 필드
  → 유저도 여러 공간에 참여할 수 있고, 공간도 여러 유저를 가질 수 있음

---

## 2. 공간 모델

```prisma
model Workspace {
  id          String           @id @default(cuid())
  slug        String           @unique // 공간 고유 식별자
  name        String
  description String?
  createdAt   DateTime         @default(now())

  users       WorkspaceUser[] // 공간 → 사용자 연결 (다대다 관계)
  projects    Project[]       // 공간 → 프로젝트 연결 (일대다 관계)
}
```

- 기본 정보: 공간 이름, 설명, 고유 식별자
- `users`: 이 공간에 속한 유저를 나타내는 관계 필드 (`WorkspaceUser`와 연결)
- `projects`: 해당 공간에 속한 프로젝트들을 나타냄 (1\:N)

---

### 2-1. 공간과 사용자 조인 모델

```prisma
model WorkspaceUser {
  id          String           @id @default(cuid())
  userId      String
  workspaceId String
  role        WorkspaceRole

  user        User             @relation(fields: [userId], references: [id])
  workspace   Workspace        @relation(fields: [workspaceId], references: [id])

  @@unique([userId, workspaceId]) // 같은 유저가 같은 공간에 중복 연결되지 않도록 제한
}

enum WorkspaceRole {
  ADMIN
  MEMBER
}
```

- 유저와 공간의 다대다 관계를 표현하는 **중개 모델**
- 어떤 유저가 어떤 공간에 어떤 역할로 참여했는지 저장
- `user`, `workspace`는 관계 필드로, 연결된 객체 데이터를 쉽게 조회할 수 있음
  → 예: `include: { user: true }`, `include: { workspace: true }`

<details>
<summary>include 사용 예시</summary>

**include 사용 안 했을 때**

```json
"workspaces": [
  {
    "id": "cmae23js900025skl30cznloq",
    "userId": "39d531dd-24de-40c2-b349-9f905f33f5d2",
    "workspaceId": "cmae23js900005sklusspenkp",
    "role": "ADMIN"
  }
]
```

**include 사용했을 때 (User가 속한 Workspace 정보 포함)**

```json
"workspaces": [
  {
    "id": "cmae23js900005sklusspenkp",
    "name": "새로운 공간",
    "slug": "123",
    "description": "새로운 공간 설명",
    "createdAt": "2025-05-07T14:51:24.777Z",
    "role": "ADMIN"
  }
]
```

</details>

---

## 3. 프로젝트 모델

```prisma
model Project {
  id           String     @id @default(cuid())
  slug         String     @unique // 프로젝트 고유 식별자
  name         String
  description  String?
  workspaceId  String
  createdAt    DateTime   @default(now())

  workspace    Workspace  @relation(fields: [workspaceId], references: [id])
  issues       Issue[] // 프로젝트 → 이슈 연결 (일대다 관계)
}
```

- 프로젝트는 하나의 워크스페이스에 소속됨 (`workspaceId`)
- `workspace` 관계 필드를 통해 해당 프로젝트의 워크스페이스 정보 조회 가능
  → 예: `include: { workspace: true }`
- `issues` 관계 필드를 통해 해당 프로젝트의 이슈 목록 조회 가능

<details>
<summary>include 사용 예시</summary>

**include 없이**

```json
"projects": [
  {
    "id": "cmagyvmyg00005s3as6e0l7lb",
    "slug": "13212",
    "name": "fasdfasd",
    "workspaceId": "cmae24gx100065sklmztgvbpd"
  }
]
```

**include 사용 시**

```json
"projects": [
  {
    "id": "cmagyvmyg00005s3as6e0l7lb",
    "slug": "13212",
    "name": "fasdfasd",
    "workspaceId": "cmae24gx100065sklmztgvbpd",
    "workspace": {
      "id": "cmae24gx100065sklmztgvbpd",
      "name": "테스트 워크스페이스",
      "slug": "12345",
      "description": "Postman 테스트용"
    }
  }
]
```

</details>

---

### 💡 중요 포인트: 관계에 따른 include 결과 구조 차이

- `Project → Workspace`는 1:1 관계이므로 `include` 결과는 단일 **객체**로 표시됨.
- 반면, `User → WorkspaceUser → Workspace`처럼 다대다 관계일 경우 **배열 안에 포함**됨.
- 관계 유형에 따라 JSON 구조가 달라지므로 혼동하지 않기

---

## 4. 이슈 모델

```prisma
model Issue {
  id          String   @id @default(cuid())
  number      Int
  title       String
  description String?
  createdAt   DateTime @default(now())

  projectId   String
  project     Project @relation(fields: [projectId], references: [id])

  authorId    String
  author      User @relation(fields: [authorId], references: [id])

  @@unique([projectId, number]) // 프로젝트 내 이슈 번호 중복 방지
}
```

- 이슈는 하나의 프로젝트에 속함
- `project` 관계 필드를 통해 해당 이슈의 프로젝트 정보 조회 가능
- `author` 관계 필드를 통해 해당 이슈의 작성자 정보 조회 가능
- `@@unique([projectId, number])` 제약 조건을 통해 프로젝트 내 이슈 번호 중복 방지

---

### 💡 중요 포인트: 이슈 번호 중복 방지

- 이슈 번호는 프로젝트 내에서 유일해야 함
- 이슈 생성 시 이슈 번호를 자동으로 부여하고, 이슈 번호가 중복되는 경우 오류 발생
