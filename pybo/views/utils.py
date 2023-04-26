# 아래 파일은 각종 유틸을 담당하는 함수를 정의합니다.(윤활유같은 역할) 

import os

# 230426
# question_list에서 is_directory함수 참고. 이미지의 경로를 받아와 그 이미지의 경로가 유효한 경로인지 검증하는 함수.
# 이후의 html에서는 그 경로가 유효한 경로(true)이면 경로에 있는 이미지 파일을 반환하고, 유효하지 않으면(false) main_01.jpg를 반환한다.

def is_directory(path1):
    bool1=os.path.isfile(path1) #반환값은 True or False 고정임. bool함수
    return bool1