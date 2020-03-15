## ts로 블로그 만들기 - 백엔드

# 알게된것.

1. 테스트 코드 작성중 테스트가 완료된후 더미테이터를 디비에서 지우기 위해 Model.remove({})를 썼는데 아래와 같은 에러 발생

-   (node:6112) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.

-   해결방법: mongoose 5.9.4버전에서는 remove()함수 => deleteOne, deleteMnay로 변경됨 그래서 Model.deleteMany({})로 변경
