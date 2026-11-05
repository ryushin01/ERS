# 에디터 설정

> 커밋할 때 lint-staged가 자동으로 정리하므로, 아래 IDE 설정은 저장할 때도 바로 맞추고 싶을 때만 켜면 됩니다. IDE는 프로젝트의 Prettier 패키지(`node_modules/prettier`)와 설정 파일을 쓰도록 지정하세요. import 순서는 ESLint가 정렬합니다.

### ![My Skills](https://skillicons.dev/icons?i=idea)

> ***ESLint***
>
> IntelliJ - 설정 - 언어 및 프레임워크 - JavaScript - 코드 품질 도구 - ESLint - `수동 ESLint 구성` 체크 활성화 - ESLint 패키지 경로 지정 - 구성 파일 경로 지정 -
`저장 시 eslint --fix 실행` 체크 활성화

> ***Prettier***
>
> IntelliJ - 설정 - 플러그인 - Prettier 설치 - 언어 및 프레임워크 - JavaScript - Prettier - `수동 Prettier 구성` 체크 활성화 - Prettier 패키지 경로
> 지정 - `'코드 서식 다시 지정' 액션 시 실행` 체크 활성화 - `저장 시 실행` 체크 활성화

> ***파일 저장 시 자동 코드 정렬 기능 활성화***
>
> IntelliJ - 설정 - 도구 - 저장 시 액션 - `코드 서식 다시 지정` 체크 활성화

> ***주석 태그 활용 및 커밋 옵션 제외 처리***
>
> IntelliJ - 기본 설정 - 설정 - 에디터 - 할일 목록 - 추가 - `NOTE` 패턴 입력 - `색 구성표 TODO 디폴트 색상 사용` 체크 비활성화 - 전경 헥스코드 영역 클릭 - `00a8ff` 헥스
> 코드 입력 후 선택 - 확인 - 적용 - 확인
>
> IntelliJ - 커밋 탭 - 커밋 및 푸시 버튼 우측의 커밋 옵션 표시 - `TODO 확인` 체크 비활성화

### ![My Skills](https://skillicons.dev/icons?i=vscode)

> ***ESLint***
>
> Visual Studio Code - 기본 설정 - 확장 - ESLint 검색 후 설치

> ***Prettier***
>
> Visual Studio Code - 기본 설정 - 확장 - Prettier 검색 후 설치 - 기본 설정 - 설정 - `default formatter` 검색 - 텍스트 편집기 - 셀렉터에서
`Prettier - Code formatter` 선택

> ***파일 저장 시 자동 코드 정렬 기능 활성화***
>
> Visual Studio Code - 기본 설정 - 설정 - `format on save` 검색 - `Editor: Format On Save` 체크 활성화
