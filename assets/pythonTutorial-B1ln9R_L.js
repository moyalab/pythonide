const e=[{id:"variable",title:"[EN] 1. 변수",description:"[EN] 값에 이름을 붙이는 변수의 기본 사용법",icon:"label",entries:[{name:"[EN] 데이터 타입",summary:"[EN] Python이 다루는 값의 종류 (정수·실수·문자열·불린·None).",details:`[EN] 프로그램에서 다루는 값에는 종류(타입)가 있다. Python에서 자주 쓰는 다섯 가지를 먼저 익혀 두자.

1) 정수 (int) : 소수점 없는 숫자.  예) 0, 1, -7, 100
2) 실수 (float) : 소수점이 있는 숫자.  예) 3.14, -0.5, 2.0
3) 문자열 (str) : 따옴표로 감싼 글자.  예) 'hello', "안녕"
4) 불린 (bool) : 참(True) 또는 거짓(False) 두 값만 가짐.
5) None : "값이 없음"을 나타내는 특별한 값.

같은 + 연산자라도 타입에 따라 다르게 동작한다.
  - 1 + 2 → 3 (숫자 더하기)
  - 'a' + 'b' → 'ab' (문자열 이어 붙이기)
그래서 변수를 쓸 때는 그 안에 어떤 타입의 값이 들었는지 알고 있어야 한다.
값의 타입은 type() 함수로 확인할 수 있다.`,example:`# 다섯 가지 기본 타입
a = 10            # int
b = 3.14          # float
c = 'hello'       # str
d = True          # bool
e = None          # NoneType

print(type(a))
print(type(b))
print(type(c))
print(type(d))
print(type(e))

# 타입에 따라 + 의 의미가 달라진다
print(1 + 2)
print('1' + '2')`},{name:"[EN] 변수란 무엇인가",summary:"[EN] 변수는 값에 붙이는 이름표이다.",details:`[EN] 프로그램은 숫자, 문자, 참/거짓 같은 값을 다룬다.
같은 값을 여러 번 쓰려면 매번 적기 번거로우니, 값에 이름을 붙여 두고 그 이름으로 꺼내 쓴다.
이렇게 값에 붙인 이름을 변수(variable)라고 한다.
Python에서는 = 기호로 변수에 값을 담는다. (수학의 = 와 달리 "오른쪽 값을 왼쪽 이름에 담아라"는 뜻)`,example:`age = 12
name = '홍길동'
print(age)
print(name)`},{name:"[EN] 변수 만들기",summary:"[EN] 이름 = 값 형식으로 변수를 만든다.",details:`[EN] 변수는 따로 선언하지 않아도, 값을 대입하는 순간 만들어진다.
왼쪽에 변수 이름, 오른쪽에 담을 값을 쓰고 가운데에 = 를 둔다.
변수에 담은 값은 print() 로 출력하거나 다른 곳에서 다시 사용할 수 있다.`,example:`score = 95
message = '안녕하세요'
pi = 3.14
print(score)
print(message)
print(pi)`},{name:"[EN] 여러 자료형 담기",summary:"[EN] 변수에는 정수, 실수, 문자열, 불린 등 어떤 값이든 담을 수 있다.",details:`[EN] Python의 변수는 자료형을 미리 지정하지 않는다. 담는 값에 따라 자료형이 결정된다.
정수(int), 실수(float), 문자열(str), 불린(bool) 모두 같은 방식으로 변수에 담을 수 있다.`,example:`count = 10
height = 175.5
city = '서울'
is_student = True
print(count)
print(height)
print(city)
print(is_student)`},{name:"[EN] 변수 값 바꾸기",summary:"[EN] 같은 변수에 새 값을 대입하면 값이 바뀐다.",details:`[EN] 한 번 만든 변수에 다른 값을 대입하면, 이전 값은 사라지고 새 값으로 덮어 쓴다.
변수 자신의 값을 이용해서 새 값을 만들 수도 있다. (예: count = count + 1)`,example:`score = 80
print(score)

score = 95
print(score)

score = score + 5
print(score)`},{name:"[EN] 변수 이름 규칙",summary:"[EN] 영문자·숫자·밑줄(_)을 쓰되, 숫자로 시작할 수 없다.",details:`[EN] 변수 이름을 정할 때 지켜야 할 규칙:
1) 영문자, 숫자, 밑줄(_)만 사용할 수 있다.
2) 숫자로 시작할 수 없다.  (1name X,  name1 O)
3) 대소문자를 구분한다.  (age 와 Age 는 다른 변수)
4) Python 예약어(if, for, class 등)는 변수 이름으로 쓸 수 없다.
관례적으로 여러 단어는 밑줄로 잇는다. (예: user_name, total_score)`,example:`user_name = '길동'
user_age = 12
total_score = 95
print(user_name, user_age, total_score)`},{name:"[EN] 여러 변수에 한 번에 대입",summary:"[EN] a, b = 1, 2 처럼 여러 변수에 동시에 값을 담을 수 있다.",details:`[EN] 콤마로 구분하면 여러 변수에 값을 한 줄에 대입할 수 있다.
같은 값을 여러 변수에 동시에 담으려면 a = b = c = 0 처럼 연결할 수 있다.`,example:`x, y, z = 1, 2, 3
print(x, y, z)

a = b = c = 0
print(a, b, c)`},{name:"[EN] type() 으로 자료형 확인",summary:"[EN] 변수에 담긴 값의 자료형은 type() 으로 확인한다.",details:`[EN] type(변수) 는 그 변수가 담고 있는 값의 자료형을 돌려준다.
<class 'int'> 는 정수, <class 'str'> 는 문자열, <class 'float'> 는 실수, <class 'bool'> 는 불린.`,example:`a = 10
b = 3.14
c = 'hello'
d = True
print(type(a))
print(type(b))
print(type(c))
print(type(d))`},{name:"[EN] 변수로 계산하기",summary:"[EN] 변수끼리 더하고 빼고 곱할 수 있다.",details:`[EN] 숫자 변수는 +, -, *, / 같은 연산자로 계산할 수 있다.
문자열 변수도 + 로 이어 붙이거나 * 정수 로 반복할 수 있다.
계산 결과를 또 다른 변수에 담아 두면 편하다.`,example:`price = 1500
count = 3
total = price * count
print(total)

first = '홍'
last = '길동'
full = first + last
print(full)`},{name:"[EN] 변수 값 교환 (스왑)",summary:"[EN] a, b = b, a 한 줄로 두 변수의 값을 맞바꾼다.",details:`[EN] 다른 언어에서는 임시 변수를 두고 세 줄로 교환하지만,
Python에서는 a, b = b, a 한 줄이면 두 변수의 값이 서로 바뀐다.`,example:`a = 10
b = 20
print(a, b)

a, b = b, a
print(a, b)`}]},{id:"string",title:"[EN] 2. 문자열",description:"[EN] 따옴표·인덱싱·슬라이싱·문자열 메서드",icon:"abc",entries:[{name:"[EN] 문자열 만들기",summary:`[EN] 작은따옴표(') 또는 큰따옴표(")로 문자열을 만든다.`,details:`[EN] Python에서는 작은따옴표와 큰따옴표가 동일하게 동작한다.
문자열 안에 따옴표를 넣으려면 다른 종류의 따옴표를 쓰거나 백슬래시(\\)로 이스케이프한다.
여러 줄 문자열은 따옴표 세 개(""" 또는 ''')로 감싼다.`,example:`s1 = 'hello'
s2 = "world"
s3 = "I'm Python"
s4 = """여러 줄
문자열"""
print(s1, s2)
print(s3)
print(s4)`},{name:"[EN] 인덱싱 (양수)",summary:"[EN] 문자열의 각 글자에 0번부터 차례로 번호가 붙는다.",details:`[EN] 문자열은 0부터 시작하는 인덱스로 글자 하나에 접근할 수 있다.
예: s = "good morning" 일 때 s[0] = "g", s[1] = "o" …`,example:`s = 'good morning'
print(s[0])
print(s[1])
print(s[5])`},{name:"[EN] 인덱싱 (음수)",summary:"[EN] 뒤에서부터 -1, -2 … 로 접근할 수 있다.",details:`[EN] 음수 인덱스는 문자열의 끝에서부터 센다.
s[-1] 은 마지막 글자, s[-2] 는 끝에서 두 번째 글자.`,example:`s = 'good morning'
print(s[-1])
print(s[-2])
print(s[-7])`},{name:"[EN] 슬라이싱",summary:"[EN] s[start:end] 로 부분 문자열을 잘라낸다.",details:`[EN] s[start:end] 는 start 인덱스부터 end - 1 인덱스까지의 부분 문자열을 반환한다.
start 를 생략하면 처음부터, end 를 생략하면 끝까지.`,example:`s = 'good morning'
print(s[0:4])
print(s[5:])
print(s[:4])
print(s[-3:])`},{name:"[EN] 슬라이싱 step",summary:"[EN] s[start:end:step] 으로 간격을 지정한다.",details:`[EN] 세 번째 값은 step(간격). step 이 2 이면 한 글자씩 건너뛴다.
step 이 음수이면 역순으로 잘라낸다.`,example:`s = 'good morning'
print(s[::2])
print(s[1::2])
print(s[::-1])`},{name:"[EN] 길이와 연결",summary:"[EN] len() 으로 길이, + 로 이어 붙이기, * 로 반복.",details:`[EN] len(s) 는 문자열의 글자 수를 돌려준다.
+ 연산자로 두 문자열을 이어 붙이고, * 정수 로 같은 문자열을 여러 번 반복할 수 있다.`,example:`s = 'good morning'
print(len(s))
print('hello' + ' ' + 'world')
print('ab' * 3)`},{name:"[EN] 자주 쓰는 메서드",summary:"[EN] upper / lower / replace / split / strip 다섯 개를 익혀 두자.",details:`[EN] upper() : 모두 대문자로
lower() : 모두 소문자로
replace(old, new) : 부분 문자열 교체
split(sep) : 구분자로 나눠 리스트로
strip() : 양 끝의 공백 제거`,example:`s = '  Hello, Python!  '
print(s.upper())
print(s.lower())
print(s.strip())
print(s.replace('Python', 'World'))
print('a,b,c'.split(','))`},{name:"[EN] f-string 으로 값 끼워 넣기",summary:'[EN] f"... {변수} ..." 형식으로 변수를 문자열 안에 끼워 넣는다.',details:`[EN] f-string 은 문자열 앞에 f 를 붙이고 중괄호 {} 안에 변수나 식을 넣어 값을 삽입한다.
간단한 계산식도 중괄호 안에 바로 쓸 수 있다.`,example:`name = '홍길동'
age = 12
print(f'{name}님은 {age}살입니다.')
print(f'내년에는 {age + 1}살이 됩니다.')`}]},{id:"list",title:"[EN] 3. 리스트",description:"[EN] 여러 값을 순서대로 담는 가변 컬렉션",icon:"list",entries:[{name:"[EN] 리스트 만들기",summary:"[EN] 대괄호 [] 안에 값을 콤마로 구분해 넣는다.",details:`[EN] 리스트는 여러 값을 순서대로 담는 자료구조이다.
서로 다른 타입의 값을 섞어 담을 수 있고, 만든 뒤에도 값을 바꿀 수 있다(가변).`,example:`nums = [1, 2, 3, 4, 5]
fruits = ['사과', '바나나', '포도']
mixed = [1, 'hello', 3.14, True]
empty = []
print(nums)
print(fruits)
print(mixed)`},{name:"[EN] 인덱싱과 슬라이싱",summary:"[EN] 문자열과 같은 방식으로 [i] 와 [start:end] 를 쓴다.",details:`[EN] 리스트도 0부터 시작하는 인덱스로 요소에 접근하고, 슬라이싱으로 부분 리스트를 잘라낼 수 있다.
음수 인덱스도 동일하게 동작한다.`,example:`nums = [10, 20, 30, 40, 50]
print(nums[0])
print(nums[-1])
print(nums[1:4])
print(nums[:3])`},{name:"[EN] append / insert",summary:"[EN] append 는 끝에 추가, insert 는 원하는 위치에 삽입.",details:`[EN] append(x) : 리스트의 맨 뒤에 x 를 추가
insert(i, x) : 인덱스 i 자리에 x 를 끼워 넣음 (뒤에 있는 요소는 한 칸씩 밀림)`,example:`nums = [1, 2, 3]
nums.append(4)
print(nums)

nums.insert(0, 100)
print(nums)`},{name:"[EN] extend / + 연산자",summary:"[EN] 두 리스트를 합칠 때 사용한다.",details:`[EN] extend(other) : other 의 요소를 모두 끝에 이어 붙임 (원본 변경)
a + b : 새 리스트를 만들어 돌려줌 (원본 유지)`,example:`a = [1, 2, 3]
b = [4, 5, 6]
a.extend(b)
print(a)

c = [1, 2] + [3, 4]
print(c)`},{name:"[EN] remove / pop",summary:"[EN] remove 는 값으로 삭제, pop 은 인덱스로 꺼내며 삭제.",details:`[EN] remove(x) : 리스트에서 x 와 일치하는 첫 번째 요소를 제거
pop(i) : 인덱스 i 의 요소를 제거하고 그 값을 반환 (i 생략 시 마지막)`,example:`fruits = ['사과', '바나나', '포도', '바나나']
fruits.remove('바나나')
print(fruits)

last = fruits.pop()
print(last)
print(fruits)`},{name:"[EN] 정렬 (sort, sorted)",summary:"[EN] sort 는 원본을 정렬, sorted 는 새 리스트를 만든다.",details:`[EN] 리스트.sort() : 원본 리스트를 직접 정렬 (반환값 없음)
sorted(리스트) : 정렬된 새 리스트를 반환 (원본 유지)
reverse=True 옵션을 주면 내림차순으로 정렬한다.`,example:`nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort()
print(nums)

words = ['banana', 'apple', 'cherry']
print(sorted(words))
print(sorted(words, reverse=True))`},{name:"[EN] 길이와 in",summary:"[EN] len 으로 개수, in 으로 포함 여부 확인.",details:`[EN] len(리스트) : 요소의 개수를 반환
x in 리스트 : 리스트 안에 x 가 있으면 True, 없으면 False`,example:`nums = [10, 20, 30, 40]
print(len(nums))
print(20 in nums)
print(99 in nums)`},{name:"[EN] 중첩 리스트",summary:"[EN] 리스트 안에 리스트를 넣어 2차원 표를 만들 수 있다.",details:`[EN] 중첩 리스트는 행렬이나 표 형태의 데이터를 다룰 때 자주 쓴다.
matrix[i][j] 처럼 두 번 인덱싱하여 접근한다.`,example:`matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
print(matrix[0])
print(matrix[1][2])`}]},{id:"tuple",title:"[EN] 4. 튜플",description:"[EN] 값을 바꿀 수 없는 묶음 자료형",icon:"lock",entries:[{name:"[EN] 튜플 만들기",summary:"[EN] 소괄호 () 안에 값을 콤마로 구분해 넣는다.",details:`[EN] 튜플은 리스트와 비슷하지만 한 번 만들면 값을 변경할 수 없다(불변).
괄호 없이 콤마만 써도 튜플이 만들어진다.`,example:`t1 = (1, 2, 3)
t2 = 4, 5, 6
empty = ()
print(t1)
print(t2)
print(type(t2))`},{name:"[EN] 단일 요소 튜플은 콤마 필수",summary:"[EN] (x,) 처럼 콤마를 붙여야 튜플이 된다.",details:`[EN] 괄호만 쓰고 콤마가 없으면 단순한 괄호 표현식으로 인식된다.
요소가 한 개인 튜플은 반드시 끝에 콤마를 붙여야 한다.`,example:`not_tuple = (5)
print(type(not_tuple))

real_tuple = (5,)
print(type(real_tuple))`},{name:"[EN] 불변성 (immutable)",summary:"[EN] 튜플의 요소는 변경·추가·삭제할 수 없다.",details:`[EN] 튜플의 요소를 바꾸려고 하면 TypeError 가 발생한다.
값이 절대 바뀌면 안 되는 경우(좌표, 설정 등) 에 튜플을 사용한다.`,example:`point = (3, 4)
print(point[0], point[1])

# 아래 줄의 주석을 풀면 TypeError 가 난다
# point[0] = 100`},{name:"[EN] 인덱싱과 슬라이싱",summary:"[EN] 리스트와 똑같이 [i], [start:end] 를 쓸 수 있다.",details:"[EN] 읽기 전용으로만 동작한다는 점을 빼면 리스트와 동일하다.",example:`t = (10, 20, 30, 40, 50)
print(t[0])
print(t[-1])
print(t[1:4])`},{name:"[EN] 튜플 언패킹",summary:"[EN] 여러 변수에 한 번에 값을 분배한다.",details:`[EN] 왼쪽 변수의 개수와 오른쪽 튜플의 요소 개수가 같아야 한다.
두 변수의 값을 교환할 때도 자주 쓰인다.`,example:`point = (3, 4)
x, y = point
print(x, y)

a, b = 1, 2
a, b = b, a
print(a, b)`},{name:"[EN] 함수의 다중 반환값",summary:"[EN] 함수에서 여러 값을 한 번에 반환하면 튜플이 된다.",details:`[EN] return 뒤에 콤마로 구분해 여러 값을 적으면 튜플로 묶여 반환된다.
호출 쪽에서는 언패킹으로 각각 받을 수 있다.`,example:`def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])
print(lo, hi)`}]},{id:"dict",title:"[EN] 5. 딕셔너리",description:"[EN] 키-값 쌍으로 데이터를 저장",icon:"data_object",entries:[{name:"[EN] 딕셔너리 만들기",summary:"[EN] 중괄호 {} 안에 키: 값 쌍을 콤마로 구분해 넣는다.",details:`[EN] 딕셔너리는 키(key)로 값(value)을 찾는 자료구조이다.
키는 보통 문자열이나 숫자처럼 변하지 않는 값을 사용한다.`,example:`student = {
    '이름': '홍길동',
    '나이': 12,
    '학년': 6,
}
empty = {}
print(student)
print(empty)`},{name:"[EN] 키로 값 가져오기",summary:"[EN] dict[key] 로 값에 접근한다.",details:`[EN] dict[key] : 키가 없으면 KeyError 발생
dict.get(key) : 키가 없으면 None 을 반환 (안전)
dict.get(key, 기본값) : 키가 없을 때 기본값을 돌려준다.`,example:`student = {'이름': '홍길동', '나이': 12}
print(student['이름'])
print(student.get('학년'))
print(student.get('학년', 0))`},{name:"[EN] 값 추가와 수정",summary:"[EN] dict[key] = value 로 추가하거나 덮어쓴다.",details:`[EN] 존재하지 않는 키에 값을 할당하면 새 항목이 추가된다.
이미 있는 키에 값을 할당하면 기존 값이 덮어써진다.`,example:`student = {'이름': '홍길동', '나이': 12}
student['학년'] = 6
print(student)

student['나이'] = 13
print(student)`},{name:"[EN] 항목 삭제",summary:"[EN] del 또는 pop 으로 키-값 쌍을 지운다.",details:`[EN] del dict[key] : 해당 키-값 쌍을 삭제
dict.pop(key) : 삭제하면서 그 값을 반환`,example:`student = {'이름': '홍길동', '나이': 12, '학년': 6}
del student['학년']
print(student)

age = student.pop('나이')
print(age)
print(student)`},{name:"[EN] keys / values / items",summary:"[EN] 키 목록, 값 목록, (키, 값) 쌍 목록을 얻는다.",details:`[EN] dict.keys() : 모든 키를 모아 돌려준다
dict.values() : 모든 값을 모아 돌려준다
dict.items() : (키, 값) 쌍을 모아 돌려준다`,example:`student = {'이름': '홍길동', '나이': 12, '학년': 6}
print(list(student.keys()))
print(list(student.values()))
print(list(student.items()))`},{name:"[EN] in 연산자로 키 존재 확인",summary:"[EN] key in dict 로 키가 있는지 검사한다.",details:`[EN] in 연산자는 딕셔너리의 키 목록을 검사한다 (값이 아님).
KeyError 를 피하기 위해 접근 전에 확인하면 안전하다.`,example:`student = {'이름': '홍길동', '나이': 12}
print('이름' in student)
print('학년' in student)
if '나이' in student:
    print(student['나이'])`},{name:"[EN] for 로 딕셔너리 순회",summary:"[EN] items() 와 함께 키와 값을 한 번에 꺼낸다.",details:`[EN] for k, v in dict.items() : 키와 값을 동시에 받아 사용
for k in dict : 키만 순회 (기본 동작)`,example:`student = {'이름': '홍길동', '나이': 12, '학년': 6}
for key, value in student.items():
    print(f'{key} → {value}')`}]},{id:"set",title:"[EN] 6. 집합",description:"[EN] 중복이 없는 값들의 모임",icon:"join_inner",entries:[{name:"[EN] 집합 만들기",summary:"[EN] 중괄호 {} 또는 set() 으로 만든다.",details:`[EN] 집합은 중복을 허용하지 않으며 순서가 없다.
빈 집합을 만들 때는 {} 가 아닌 set() 을 써야 한다 ({} 는 빈 딕셔너리).`,example:`s1 = {1, 2, 3, 4}
s2 = set([3, 4, 5, 6])
empty = set()
print(s1)
print(s2)
print(empty)`},{name:"[EN] 중복 자동 제거",summary:"[EN] 리스트를 set 으로 바꾸면 중복이 사라진다.",details:`[EN] 집합은 같은 값을 두 번 담지 않으므로, 리스트의 중복을 제거할 때 자주 쓴다.
단, 원래 순서는 보장되지 않는다.`,example:`nums = [1, 2, 2, 3, 3, 3, 4]
unique = set(nums)
print(unique)
print(list(unique))`},{name:"[EN] add / remove",summary:"[EN] add 로 추가, remove 로 제거.",details:`[EN] add(x) : 집합에 x 를 추가 (이미 있으면 변화 없음)
remove(x) : x 를 제거 (없으면 KeyError)
discard(x) : x 를 제거 (없어도 에러 없음)`,example:`s = {1, 2, 3}
s.add(4)
s.add(2)
print(s)

s.remove(1)
s.discard(99)
print(s)`},{name:"[EN] 합집합 (union, |)",summary:"[EN] 두 집합을 합쳐 모든 요소를 모은다.",details:"[EN] a | b 또는 a.union(b) : 두 집합의 모든 요소를 가진 새 집합을 돌려준다.",example:`a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)
print(a.union(b))`},{name:"[EN] 교집합 (intersection, &)",summary:"[EN] 두 집합 모두에 들어 있는 요소만 남긴다.",details:"[EN] a & b 또는 a.intersection(b) : 양쪽에 모두 있는 요소만 모은 새 집합을 돌려준다.",example:`a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)
print(a.intersection(b))`},{name:"[EN] 차집합 (difference, -)",summary:"[EN] a 에만 있고 b 에는 없는 요소를 남긴다.",details:"[EN] a - b 또는 a.difference(b) : a 에서 b 의 요소를 모두 뺀 새 집합을 돌려준다.",example:`a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a - b)
print(b - a)`},{name:"[EN] in 연산자로 포함 확인",summary:"[EN] x in s 로 x 가 들어 있는지 빠르게 검사한다.",details:"[EN] 집합의 in 연산은 리스트보다 훨씬 빠르다(평균 O(1)). 검색이 자주 필요할 때 유리하다.",example:`s = {'사과', '바나나', '포도'}
print('사과' in s)
print('수박' in s)`}]},{id:"if",title:"[EN] 7. 조건문",description:"[EN] if / elif / else 로 흐름 제어",icon:"fork_right",entries:[{name:"[EN] if 기본",summary:"[EN] 조건이 참일 때만 안쪽 블록을 실행한다.",details:`[EN] Python 은 들여쓰기로 블록을 구분한다 (보통 공백 4칸).
조건식 끝에 콜론(:) 을 붙이고 다음 줄을 들여쓴다.`,example:`score = 85
if score >= 60:
    print('합격')`},{name:"[EN] if / else",summary:"[EN] 조건이 거짓일 때 실행할 블록을 else 에 적는다.",details:"[EN] if 조건이 False 이면 else 블록이 실행된다. 두 갈래 중 하나만 실행된다.",example:`score = 50
if score >= 60:
    print('합격')
else:
    print('불합격')`},{name:"[EN] if / elif / else",summary:"[EN] 여러 조건을 위에서부터 차례로 검사한다.",details:`[EN] 맨 처음 참이 되는 분기 하나만 실행되고 나머지는 모두 건너뛴다.
elif 는 여러 개를 이어서 쓸 수 있고, 마지막 else 는 생략 가능하다.`,example:`score = 75
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
else:
    grade = 'F'
print(grade)`},{name:"[EN] 비교 연산자",summary:"[EN] ==, !=, <, <=, >, >= 로 두 값을 비교한다.",details:`[EN] == (같다), != (다르다), < (작다), <= (작거나 같다), > (크다), >= (크거나 같다).
비교의 결과는 항상 True 또는 False 이다.`,example:`a = 10
b = 20
print(a == b)
print(a != b)
print(a < b)
print(a <= 10)`},{name:"[EN] 논리 연산자 (and, or, not)",summary:"[EN] 여러 조건을 묶거나 결과를 뒤집는다.",details:`[EN] and : 둘 다 참이어야 참
or  : 하나라도 참이면 참
not : 참/거짓을 뒤집음`,example:`age = 15
score = 85
if age >= 13 and score >= 80:
    print('상위반 배정')

is_holiday = False
if not is_holiday:
    print('오늘은 평일입니다')`},{name:"[EN] 중첩 조건문",summary:"[EN] if 안에 또 다른 if 를 넣을 수 있다.",details:`[EN] 바깥 조건이 참일 때만 안쪽 조건을 검사한다.
들여쓰기 단계가 깊어지면 가독성이 떨어지므로 적당히 분리하는 것이 좋다.`,example:`score = 85
attendance = 95
if score >= 60:
    if attendance >= 80:
        print('합격')
    else:
        print('출석 부족')
else:
    print('점수 부족')`},{name:"[EN] 조건 표현식 (삼항 연산)",summary:"[EN] A if 조건 else B 형태로 한 줄에 쓸 수 있다.",details:`[EN] 간단한 if/else 는 한 줄로 줄여 쓸 수 있다.
결과를 변수에 바로 대입하거나 함수 인자로 넘길 때 편하다.`,example:`score = 75
result = '합격' if score >= 60 else '불합격'
print(result)

n = -3
abs_n = n if n >= 0 else -n
print(abs_n)`}]},{id:"comprehension",title:"[EN] 8. 리스트 컴프리헨션",description:"[EN] 한 줄로 리스트·딕셔너리·집합 만들기",icon:"auto_awesome",entries:[{name:"[EN] 기본 형식",summary:"[EN] [식 for 변수 in 반복가능한 것] 으로 리스트를 만든다.",details:`[EN] 반복문으로 리스트를 채우는 코드를 한 줄로 줄여 쓸 수 있다.
왼쪽의 식이 각 요소에 적용된 결과들이 새 리스트가 된다.`,example:`# for 문으로 만들기
squares = []
for i in range(1, 6):
    squares.append(i * i)
print(squares)

# 컴프리헨션으로 만들기 (같은 결과)
squares2 = [i * i for i in range(1, 6)]
print(squares2)`},{name:"[EN] 조건 필터",summary:"[EN] 뒤에 if 를 붙여 원하는 요소만 골라낸다.",details:"[EN] [식 for 변수 in 반복가능 if 조건] 형태로, 조건이 참인 요소만 식에 통과시킨다.",example:`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [n for n in nums if n % 2 == 0]
print(evens)

words = ['apple', 'banana', 'cherry', 'kiwi']
short = [w for w in words if len(w) <= 5]
print(short)`},{name:"[EN] if-else 표현식",summary:"[EN] 식 안에 if-else 를 두면 모든 요소를 변환한다.",details:`[EN] 필터(뒤쪽 if) 와 식 안의 if-else 는 위치가 다르다.
식 안의 if-else 는 모든 요소를 그대로 두지만 값을 바꿔 준다.`,example:`nums = [1, 2, 3, 4, 5]
labels = ['짝수' if n % 2 == 0 else '홀수' for n in nums]
print(labels)`},{name:"[EN] 중첩 컴프리헨션",summary:"[EN] for 를 두 개 써서 2차원 데이터를 만든다.",details:`[EN] for 절을 두 번 쓰면 바깥 for 가 먼저, 안쪽 for 가 그 안에서 도는 형태가 된다.
중첩 리스트(행렬)를 만들거나 평탄화할 때 자주 쓴다.`,example:`# 구구단 2단~4단
table = [[i, j, i * j] for i in range(2, 5) for j in range(1, 4)]
for row in table:
    print(row)`},{name:"[EN] dict 컴프리헨션",summary:"[EN] {키: 값 for ...} 로 딕셔너리를 만든다.",details:`[EN] 리스트 컴프리헨션과 똑같은 문법에 콜론(:) 으로 키와 값을 구분한다.
두 리스트를 짝지어 딕셔너리로 만들 때 zip 과 함께 자주 쓴다.`,example:`squares = {n: n * n for n in range(1, 6)}
print(squares)

names = ['홍길동', '이몽룡', '성춘향']
ages = [12, 13, 11]
people = {n: a for n, a in zip(names, ages)}
print(people)`},{name:"[EN] set 컴프리헨션",summary:"[EN] {식 for ...} 로 집합을 만든다 (중복 자동 제거).",details:`[EN] 대괄호 [] 대신 중괄호 {} 를 쓰고 키:값 형태가 아니면 set 컴프리헨션이다.
결과에 중복이 있어도 자동으로 한 번씩만 남는다.`,example:`nums = [1, 2, 2, 3, 3, 3, 4]
unique_squares = {n * n for n in nums}
print(unique_squares)`}]},{id:"loop",title:"[EN] 9. 반복문",description:"[EN] for 와 while 로 반복 처리",icon:"loop",entries:[{name:"[EN] for + range",summary:"[EN] range(n) 으로 0 ~ n-1 까지 n 번 반복한다.",details:`[EN] range(n) : 0 부터 n-1 까지의 정수를 차례로 만들어낸다.
횟수가 정해진 반복에는 for 와 range 조합이 가장 자연스럽다.`,example:`for i in range(5):
    print(i)

print('---')
for i in range(3):
    print('hello')`},{name:"[EN] range 시작 / 끝 / 스텝",summary:"[EN] range(start, stop, step) 으로 범위와 간격을 조절한다.",details:`[EN] range(a, b)    : a 부터 b-1 까지
range(a, b, s) : a 부터 b-1 까지 s 만큼씩 증가
step 이 음수이면 역순으로 진행한다.`,example:`for i in range(1, 6):
    print(i)

print('---')
for i in range(0, 10, 2):
    print(i)

print('---')
for i in range(10, 0, -1):
    print(i)`},{name:"[EN] 리스트 / 문자열 순회",summary:"[EN] 컬렉션을 직접 for 에 넣어 요소를 하나씩 꺼낸다.",details:`[EN] 리스트, 튜플, 문자열, 집합, 딕셔너리(키) 모두 그대로 for 에 넣을 수 있다.
인덱스가 필요 없을 때는 이쪽이 더 간결하고 빠르다.`,example:`fruits = ['사과', '바나나', '포도']
for f in fruits:
    print(f)

print('---')
for ch in 'Python':
    print(ch)`},{name:"[EN] while 기본",summary:"[EN] 조건이 참인 동안 계속 반복한다.",details:`[EN] 반복 횟수를 미리 알 수 없을 때 while 을 쓴다.
루프 안에서 조건을 변화시키지 않으면 무한 루프에 빠지므로 주의해야 한다.`,example:`n = 1
total = 0
while n <= 10:
    total += n
    n += 1
print(total)`},{name:"[EN] break",summary:"[EN] break 를 만나면 즉시 반복을 끝낸다.",details:`[EN] 특정 조건이 만족되면 더 이상 반복이 필요 없을 때 사용한다.
가장 안쪽 반복문 한 단계만 빠져 나간다.`,example:`for i in range(1, 100):
    if i * i > 50:
        print('처음으로 제곱이 50을 넘는 값:', i)
        break`},{name:"[EN] continue",summary:"[EN] continue 는 이번 회차만 건너뛰고 다음으로 넘어간다.",details:`[EN] 반복 자체를 끝내는 break 와 달리, continue 는 한 번만 건너뛴다.
특정 값을 처리에서 제외하고 싶을 때 사용한다.`,example:`for i in range(1, 11):
    if i % 2 == 0:
        continue
    print(i)`},{name:"[EN] enumerate",summary:"[EN] 인덱스와 값을 동시에 받아 가며 반복한다.",details:`[EN] enumerate(리스트) 는 (인덱스, 값) 쌍을 차례로 만들어낸다.
인덱스가 필요한 반복에서 i 를 따로 관리하지 않아도 된다.`,example:`fruits = ['사과', '바나나', '포도']
for i, f in enumerate(fruits):
    print(i, f)

# 시작 번호를 1로
for i, f in enumerate(fruits, start=1):
    print(i, f)`},{name:"[EN] zip",summary:"[EN] 여러 리스트를 짝지어 동시에 순회한다.",details:`[EN] zip(a, b) : 두 리스트의 같은 인덱스 요소를 묶어 (a[i], b[i]) 쌍을 만들어 준다.
길이가 다르면 짧은 쪽에 맞춰 끊긴다.`,example:`names = ['홍길동', '이몽룡', '성춘향']
scores = [88, 92, 76]
for n, s in zip(names, scores):
    print(f'{n}: {s}점')`}]},{id:"function",title:"[EN] 10. 함수",description:"[EN] 함수 정의·반환·파라미터 전달",icon:"functions",entries:[{name:"[EN] 함수 만들기 (def)",summary:"[EN] def 이름(매개변수): 형태로 함수를 정의한다.",details:`[EN] 함수는 코드를 묶어 이름을 붙여 놓은 것이다.
같은 처리를 여러 번 해야 할 때 함수로 묶어 두면 호출 한 줄로 다시 사용할 수 있다.
def 다음에 함수 이름, 괄호 안에 매개변수, 끝에 콜론(:) 을 붙이고 다음 줄을 들여쓴다.`,example:`def greet():
    print('안녕하세요!')

# 함수 호출
greet()
greet()`},{name:"[EN] 매개변수와 인자",summary:"[EN] 괄호 안에 변수 이름을 적어 값을 받아 처리한다.",details:`[EN] 매개변수(parameter) : 함수 정의에서 괄호 안에 적는 변수 이름
인자(argument) : 함수를 호출할 때 실제로 넘겨주는 값
여러 매개변수는 콤마로 구분하며, 호출 시 같은 순서로 값을 전달한다(위치 인자).`,example:`def add(a, b):
    print(f'{a} + {b} = {a + b}')

add(3, 5)
add(10, 20)`},{name:"[EN] 반환값 (return)",summary:"[EN] return 으로 결과를 돌려준다.",details:`[EN] return 뒤에 적은 값이 함수의 결과로 돌려진다.
return 을 만나면 함수는 즉시 끝난다 (그 아래 줄은 실행되지 않음).
return 을 쓰지 않거나 값 없이 return 만 적으면 None 이 반환된다.`,example:`def square(x):
    return x * x

result = square(5)
print(result)
print(square(7) + square(3))`},{name:"[EN] 여러 값 반환",summary:"[EN] return 뒤에 콤마로 여러 값을 적으면 튜플로 묶여 반환된다.",details:`[EN] 받는 쪽에서 변수 여러 개로 한 번에 받을 수 있다(언패킹).
한 변수로 받으면 튜플 하나로 들어온다.`,example:`def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])
print(lo, hi)

result = min_max([10, 20, 30])
print(result)`},{name:"[EN] 기본값 매개변수 (default)",summary:"[EN] 매개변수에 기본값을 주면 호출 시 생략할 수 있다.",details:`[EN] def f(x, y=10) 처럼 기본값을 지정해 두면 y 를 넘기지 않고 호출해도 된다.
기본값이 있는 매개변수는 기본값이 없는 매개변수보다 뒤에 와야 한다.`,example:`def greet(name, message='안녕하세요'):
    print(f'{name}님, {message}!')

greet('홍길동')
greet('이몽룡', '반갑습니다')`},{name:"[EN] 키워드 인자",summary:"[EN] 호출할 때 매개변수=값 형태로 이름을 지정해 전달할 수 있다.",details:`[EN] 키워드 인자를 쓰면 매개변수 순서를 외우지 않아도 되고, 코드가 읽기 쉬워진다.
위치 인자와 키워드 인자를 섞어 쓸 때는 위치 인자를 먼저 적는다.`,example:`def make_user(name, age, city):
    print(f'{name} ({age}세, {city})')

make_user(name='홍길동', age=12, city='서울')
make_user('이몽룡', city='부산', age=13)`},{name:"[EN] 가변 위치 인자 (*args)",summary:"[EN] * 를 붙인 매개변수는 임의 개수의 위치 인자를 튜플로 받는다.",details:`[EN] 몇 개의 인자가 들어올지 미리 알 수 없을 때 *args 를 쓴다.
args 라는 이름은 관습일 뿐이고 다른 이름도 가능하지만, 보통 args 로 쓴다.`,example:`def total(*nums):
    print('받은 값:', nums)
    return sum(nums)

print(total(1, 2, 3))
print(total(10, 20, 30, 40, 50))`},{name:"[EN] 가변 키워드 인자 (**kwargs)",summary:"[EN] ** 를 붙인 매개변수는 임의 개수의 키워드 인자를 dict 로 받는다.",details:`[EN] 키=값 형태의 인자가 몇 개든 자유롭게 받고 싶을 때 **kwargs 를 쓴다.
함수 안에서는 일반 딕셔너리처럼 다룰 수 있다.
*args 와 **kwargs 를 함께 쓸 수도 있다 (순서: 일반, *args, **kwargs).`,example:`def show_info(**info):
    for key, value in info.items():
        print(f'{key}: {value}')

show_info(name='홍길동', age=12, city='서울')`},{name:"[EN] lambda (한 줄 익명 함수)",summary:"[EN] lambda 매개변수: 식 형태로 짧은 함수를 한 줄에 만든다.",details:`[EN] 이름 없이 식 하나로 끝나는 작은 함수를 만들 때 사용한다.
sorted, map, filter 처럼 함수를 인자로 받는 자리에 자주 쓴다.`,example:`# 일반 def 와 같은 효과
double = lambda x: x * 2
print(double(5))

# sorted 의 정렬 기준으로 사용
words = ['banana', 'apple', 'kiwi']
print(sorted(words, key=lambda w: len(w)))

# map 과 함께
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda n: n * n, nums))
print(squares)`},{name:"[EN] 변수 범위 (지역 / 전역)",summary:"[EN] 함수 안에서 만든 변수는 함수 밖에서는 보이지 않는다.",details:`[EN] 함수 안에서 만든 변수는 지역 변수(local) 라서 함수가 끝나면 사라진다.
함수 밖에서 만든 변수는 전역 변수(global) 로 함수 안에서 읽을 수 있다.
함수 안에서 전역 변수의 값을 바꾸려면 global 키워드로 명시해야 한다.`,example:`count = 0  # 전역 변수

def show_local():
    msg = '안녕'  # 지역 변수
    print(msg)
    print(count)  # 전역 변수는 읽기 가능

def increase():
    global count
    count += 1

show_local()
increase()
increase()
print('count =', count)`}]},{id:"examples",title:"[EN] 11. 예제",description:"[EN] 지금까지 배운 내용을 활용한 5가지 연습 예제",icon:"lightbulb",entries:[{name:"[EN] 짝수·홀수 판별기",summary:"[EN] 변수와 조건문으로 숫자가 짝수인지 홀수인지 판별한다.",details:`[EN] 나머지 연산자 % 는 두 수의 나머지를 돌려준다.
어떤 정수를 2로 나누어 나머지가 0이면 짝수, 아니면 홀수다.

조건문 if / else 와 비교 연산자 == 를 함께 쓰는 가장 기본적인 패턴이다.
n 의 값을 바꿔 가며 결과가 어떻게 달라지는지 확인해 보자.`,example:`# 짝수·홀수 판별기
n = 7

if n % 2 == 0:
    print(f'{n}은(는) 짝수입니다.')
else:
    print(f'{n}은(는) 홀수입니다.')`},{name:"[EN] 구구단 출력",summary:"[EN] for 와 range 로 원하는 단의 구구단을 한 번에 출력한다.",details:`[EN] dan 변수에 출력하고 싶은 단을 담고, range(1, 10) 으로 1부터 9까지 9번 반복한다.
반복 변수 i 가 1, 2, 3 ... 9 로 바뀌는 동안 dan * i 를 계산해 출력한다.

f-string 의 중괄호 {} 안에는 변수뿐 아니라 식(dan * i)도 그대로 쓸 수 있다.
dan 값을 2~9 사이 다른 숫자로 바꿔 다른 단도 출력해 보자.`,example:`# 구구단 출력
dan = 7

for i in range(1, 10):
    print(f'{dan} x {i} = {dan * i}')`},{name:"[EN] 리스트 평균 계산",summary:"[EN] 리스트와 내장 함수 sum, len 으로 평균을 구한다.",details:`[EN] sum(리스트) 는 모든 요소의 합을, len(리스트) 는 요소의 개수를 돌려준다.
평균은 합 ÷ 개수 이므로 sum(scores) / len(scores) 로 계산할 수 있다.

같은 동작을 def 로 함수화해 두면, 다른 숫자 리스트에도 그대로 재사용할 수 있다.
함수의 매개변수 이름은 nums 처럼 일반적인 이름으로 두는 것이 보통이다.`,example:`# 리스트 평균 계산
def average(nums):
    return sum(nums) / len(nums)

scores = [88, 92, 76, 81, 95]
avg = average(scores)
print(f'점수: {scores}')
print(f'평균: {avg}점')`},{name:"[EN] 별 피라미드 그리기",summary:"[EN] 반복문과 문자열 곱셈(*)으로 별 모양을 만든다.",details:`[EN] 문자열 * 정수 는 그 문자열을 정수 횟수만큼 반복한다.  예) "*" * 3  →  "***"
for 와 range 를 써서 1, 2, 3 … 으로 별 개수를 늘려 가며 출력하면 피라미드가 완성된다.

range(1, height + 1) 로 i 가 1부터 height 까지 가도록 만든 점에 주목하자.
height 값을 5, 7, 10 등으로 바꿔 가며 결과 모양을 비교해 보자.`,example:`# 별 피라미드 그리기
height = 5

for i in range(1, height + 1):
    print('*' * i)`},{name:"[EN] 회문(팰린드롬) 판별",summary:"[EN] 슬라이싱 [::-1] 로 뒤집어 원래 문자열과 같은지 비교한다.",details:`[EN] 회문(palindrome)은 "level", "기러기" 처럼 거꾸로 읽어도 같은 문자열을 말한다.
슬라이싱 s[::-1] 은 문자열을 끝에서부터 한 글자씩 가져와 뒤집어 준다.
뒤집은 결과가 원본과 같으면 회문, 다르면 회문이 아니다.

== 비교의 결과는 True 또는 False 이므로 그대로 return 하면 된다.
함수로 만들어 두면 어떤 문자열이든 한 줄로 검사할 수 있다.`,example:`# 회문(팰린드롬) 판별
def is_palindrome(s):
    return s == s[::-1]

print(is_palindrome('level'))
print(is_palindrome('python'))
print(is_palindrome('기러기'))
print(is_palindrome('hello'))`}]}];export{e as PYTHON_TUTORIAL};
