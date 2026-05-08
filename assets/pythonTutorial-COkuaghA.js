const e=[{id:"variable",title:"1. Variables",description:"How to use variables that name values",icon:"label",entries:[{name:"Data types",summary:"The kinds of values Python handles (int, float, str, bool, None).",details:`Values handled in a program have a kind (type). Get familiar with five common ones in Python first.

1) Integer (int): a number with no decimal point. e.g., 0, 1, -7, 100
2) Float (float): a number with a decimal point. e.g., 3.14, -0.5, 2.0
3) String (str): characters wrapped in quotes. e.g., 'hello', "hi"
4) Boolean (bool): only two values, True or False.
5) None: a special value meaning "no value".

The same + operator behaves differently depending on the types involved.
  - 1 + 2 → 3 (number addition)
  - 'a' + 'b' → 'ab' (string concatenation)
So when using a variable, you need to know what type of value it holds.
You can check a value's type with the type() function.`,example:`# The five basic types
a = 10            # Integer (int)
b = 3.14          # Float (float)
c = 'hello'       # String (str)
d = True          # Boolean (bool)
e = None          # No value (NoneType)

print(type(a))
print(type(b))
print(type(c))
print(type(d))
print(type(e))

# The meaning of + changes depending on the types
print(1 + 2)
print('1' + '2')`},{name:"What is a variable",summary:"A variable is a label attached to a value.",details:`A program handles values like numbers, characters, and true/false.
Writing the same value over and over is tedious, so we attach a name to a value and use it through that name.
A name attached to a value like this is called a variable.
In Python, you put a value into a variable using the = sign. (Unlike math's =, it means "store the value on the right into the name on the left".)`,example:`age = 12
name = 'John Doe'
print(age)
print(name)`},{name:"Creating a variable",summary:"Create a variable using the form: name = value.",details:`You do not need to declare a variable separately; it is created the moment you assign a value.
Write the variable name on the left, the value to store on the right, and = in between.
You can print the stored value with print() or use it again elsewhere.`,example:`score = 95
message = 'Hello'
pi = 3.14
print(score)
print(message)
print(pi)`},{name:"Storing different types",summary:"A variable can hold any value: int, float, str, bool, etc.",details:`Python variables do not have a predeclared type. The type is decided by the value you store.
Integer (int), float (float), string (str), and boolean (bool) all go into a variable the same way.`,example:`count = 10
height = 175.5
city = 'Seoul'
is_student = True
print(count)
print(height)
print(city)
print(is_student)`},{name:"Changing a variable's value",summary:"Assigning a new value to the same variable replaces the old one.",details:`When you assign another value to an existing variable, the previous value is gone and overwritten by the new one.
You can also use the variable's own value to compute a new value (e.g., count = count + 1).`,example:`score = 80
print(score)

score = 95
print(score)

score = score + 5
print(score)`},{name:"Variable naming rules",summary:"Use letters, digits, and underscores (_); names cannot start with a digit.",details:`Rules to follow when choosing a variable name:
1) Only letters, digits, and the underscore (_) are allowed.
2) A name cannot start with a digit. (1name X, name1 O)
3) Names are case-sensitive. (age and Age are different variables.)
4) Python keywords (if, for, class, etc.) cannot be used as variable names.
By convention, multiple words are joined by underscores. (e.g., user_name, total_score)`,example:`user_name = 'Gildong'
user_age = 12
total_score = 95
print(user_name, user_age, total_score)`},{name:"Assign to multiple variables at once",summary:"You can assign values to several variables on one line, like a, b = 1, 2.",details:`With commas, you can assign values to multiple variables on a single line.
To put the same value into several variables at once, you can chain them: a = b = c = 0.`,example:`x, y, z = 1, 2, 3
print(x, y, z)

a = b = c = 0
print(a, b, c)`},{name:"Check the type with type()",summary:"Use type() to check the type of the value held by a variable.",details:`type(variable) returns the type of the value the variable holds.
<class 'int'> is integer, <class 'str'> is string, <class 'float'> is float, <class 'bool'> is boolean.`,example:`a = 10
b = 3.14
c = 'hello'
d = True
print(type(a))
print(type(b))
print(type(c))
print(type(d))`},{name:"Calculations with variables",summary:"Variables can be added, subtracted, and multiplied together.",details:`Numeric variables can be combined with operators like +, -, *, /.
String variables can be concatenated with + and repeated with * an integer.
It is convenient to store the result in another variable.`,example:`price = 1500
count = 3
total = price * count
print(total)

first = 'John'
last = 'Doe'
full = first + last
print(full)`},{name:"Swapping variable values",summary:"a, b = b, a swaps two variables' values in one line.",details:`Other languages use a temporary variable and three lines to swap,
but in Python, a, b = b, a swaps two variables' values in a single line.`,example:`a = 10
b = 20
print(a, b)

a, b = b, a
print(a, b)`}]},{id:"string",title:"2. Strings",description:"Quotes, indexing, slicing, and string methods",icon:"abc",entries:[{name:"Creating strings",summary:`Use single quotes (') or double quotes (") to make a string.`,details:`In Python, single and double quotes behave the same.
To put a quote inside a string, use the other kind of quote, or escape it with a backslash (\\).
Multi-line strings are wrapped in triple quotes (""" or ''').`,example:`s1 = 'hello'
s2 = "world"
s3 = "I'm Python"
s4 = """multi-line
string"""
print(s1, s2)
print(s3)
print(s4)`},{name:"Indexing (positive)",summary:"Each character in a string is numbered starting from 0.",details:`You can access individual characters with a 0-based index.
e.g., for s = "good morning", s[0] = "g", s[1] = "o" ...`,example:`s = 'good morning'
print(s[0])
print(s[1])
print(s[5])`},{name:"Indexing (negative)",summary:"You can access from the end with -1, -2 ...",details:`A negative index counts from the end of the string.
s[-1] is the last character; s[-2] is the second-to-last.`,example:`s = 'good morning'
print(s[-1])
print(s[-2])
print(s[-7])`},{name:"Slicing",summary:"Use s[start:end] to take a substring.",details:`s[start:end] returns the substring from index start through end - 1.
Omit start to begin from 0; omit end to go to the end.`,example:`s = 'good morning'
print(s[0:4])
print(s[5:])
print(s[:4])
print(s[-3:])`},{name:"Slicing step",summary:"Specify a step with s[start:end:step].",details:`The third value is the step (interval). With step 2, you skip one character at a time.
A negative step slices in reverse order.`,example:`s = 'good morning'
print(s[::2])
print(s[1::2])
print(s[::-1])`},{name:"Length and concatenation",summary:"len() for length, + to concatenate, * to repeat.",details:`len(s) returns the number of characters in the string.
The + operator joins two strings; * an integer repeats the same string several times.`,example:`s = 'good morning'
print(len(s))
print('hello' + ' ' + 'world')
print('ab' * 3)`},{name:"Common methods",summary:"Get familiar with five: upper / lower / replace / split / strip.",details:`upper() : convert to all upper case
lower() : convert to all lower case
replace(old, new) : replace a substring
split(sep) : split by a separator into a list
strip() : remove whitespace from both ends`,example:`s = '  Hello, Python!  '
print(s.upper())
print(s.lower())
print(s.strip())
print(s.replace('Python', 'World'))
print('a,b,c'.split(','))`},{name:"Inserting values with f-strings",summary:'Use the form f"... {variable} ..." to embed variables in a string.',details:`Prefix the string with f and put a variable or expression inside curly braces {} to insert its value.
Simple expressions can be written directly inside the braces.`,example:`name = 'John Doe'
age = 12
print(f'{name} is {age} years old.')
print(f'Next year, {name} will be {age + 1}.')`}]},{id:"list",title:"3. Lists",description:"A mutable collection that holds values in order",icon:"list",entries:[{name:"Creating a list",summary:"Put comma-separated values inside square brackets [].",details:`A list is a data structure that holds several values in order.
It can mix values of different types, and you can change values after the list is created (mutable).`,example:`nums = [1, 2, 3, 4, 5]
fruits = ['apple', 'banana', 'grape']
mixed = [1, 'hello', 3.14, True]
empty = []
print(nums)
print(fruits)
print(mixed)`},{name:"Indexing and slicing",summary:"Use [i] and [start:end] just like with strings.",details:`Lists also use 0-based indexing to access elements, and slicing to take a sublist.
Negative indexing works the same way.`,example:`nums = [10, 20, 30, 40, 50]
print(nums[0])
print(nums[-1])
print(nums[1:4])
print(nums[:3])`},{name:"append / insert",summary:"append adds at the end; insert places at a chosen position.",details:`append(x) : add x to the end of the list
insert(i, x) : insert x at index i (later elements shift one place to the right)`,example:`nums = [1, 2, 3]
nums.append(4)
print(nums)

nums.insert(0, 100)
print(nums)`},{name:"extend / + operator",summary:"Use them to combine two lists.",details:`extend(other) : append every element of other to the end (modifies the original)
a + b : returns a new list (originals unchanged)`,example:`a = [1, 2, 3]
b = [4, 5, 6]
a.extend(b)
print(a)

c = [1, 2] + [3, 4]
print(c)`},{name:"remove / pop",summary:"remove deletes by value; pop removes and returns by index.",details:`remove(x) : remove the first element equal to x
pop(i) : remove the element at index i and return its value (defaults to the last)`,example:`fruits = ['apple', 'banana', 'grape', 'banana']
fruits.remove('banana')
print(fruits)

last = fruits.pop()
print(last)
print(fruits)`},{name:"Sorting (sort, sorted)",summary:"sort sorts in place; sorted returns a new list.",details:`list.sort() : sorts the list in place (returns nothing)
sorted(list) : returns a new sorted list (original unchanged)
Pass reverse=True to sort in descending order.`,example:`nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort()
print(nums)

words = ['banana', 'apple', 'cherry']
print(sorted(words))
print(sorted(words, reverse=True))`},{name:"Length and in",summary:"len for the count, in for membership.",details:`len(list) : returns the number of elements
x in list : True if x is in the list, False otherwise`,example:`nums = [10, 20, 30, 40]
print(len(nums))
print(20 in nums)
print(99 in nums)`},{name:"Nested lists",summary:"You can put lists inside a list to make a 2D table.",details:`Nested lists are often used for matrix or table-like data.
Access elements by indexing twice, like matrix[i][j].`,example:`matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
print(matrix[0])
print(matrix[1][2])`}]},{id:"tuple",title:"4. Tuples",description:"A grouping of values that cannot be changed",icon:"lock",entries:[{name:"Creating a tuple",summary:"Put comma-separated values inside parentheses ().",details:`A tuple is similar to a list, but once created, its values cannot be changed (immutable).
Even without parentheses, just commas alone create a tuple.`,example:`t1 = (1, 2, 3)
t2 = 4, 5, 6
empty = ()
print(t1)
print(t2)
print(type(t2))`},{name:"A single-element tuple needs a comma",summary:"Add a comma like (x,) to make it a tuple.",details:`With only parentheses and no comma, it is treated as a parenthesized expression, not a tuple.
A tuple with one element must end with a comma.`,example:`not_tuple = (5)
print(type(not_tuple))

real_tuple = (5,)
print(type(real_tuple))`},{name:"Immutability",summary:"Tuple elements cannot be changed, added, or removed.",details:`Trying to change a tuple element raises a TypeError.
Use tuples when values must never change (coordinates, settings, etc.).`,example:`point = (3, 4)
print(point[0], point[1])

# Uncomment the line below to see the TypeError
# point[0] = 100`},{name:"Indexing and slicing",summary:"You can use [i] and [start:end] exactly as with lists.",details:"Behaves the same as a list except that it is read-only.",example:`t = (10, 20, 30, 40, 50)
print(t[0])
print(t[-1])
print(t[1:4])`},{name:"Tuple unpacking",summary:"Distribute values into several variables at once.",details:`The number of variables on the left must match the number of elements in the tuple on the right.
It is also handy when swapping two values.`,example:`point = (3, 4)
x, y = point
print(x, y)

a, b = 1, 2
a, b = b, a
print(a, b)`},{name:"Returning multiple values from a function",summary:"Returning several values from a function packs them into a tuple.",details:`If you list comma-separated values after return, they are bundled into a tuple.
The caller can receive them with unpacking.`,example:`def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])
print(lo, hi)`}]},{id:"dict",title:"5. Dictionaries",description:"Store data as key-value pairs",icon:"data_object",entries:[{name:"Creating a dictionary",summary:"Put comma-separated key: value pairs inside curly braces {}.",details:`A dictionary is a data structure that looks up values by their keys.
Keys are usually immutable values like strings or numbers.`,example:`student = {
    'name': 'John Doe',
    'age': 12,
    'grade': 6,
}
empty = {}
print(student)
print(empty)`},{name:"Getting a value by its key",summary:"Access a value with dict[key].",details:`dict[key] : raises KeyError if the key is missing
dict.get(key) : returns None if the key is missing (safe)
dict.get(key, default) : returns default when the key is missing.`,example:`student = {'name': 'John Doe', 'age': 12}
print(student['name'])
print(student.get('grade'))
print(student.get('grade', 0))`},{name:"Adding and updating values",summary:"Use dict[key] = value to add or overwrite.",details:`Assigning to a key that does not exist adds a new entry.
Assigning to an existing key overwrites the old value.`,example:`student = {'name': 'John Doe', 'age': 12}
student['grade'] = 6
print(student)

student['age'] = 13
print(student)`},{name:"Deleting an entry",summary:"Use del or pop to remove a key-value pair.",details:`del dict[key] : remove that key-value pair
dict.pop(key) : remove it and return the value`,example:`student = {'name': 'John Doe', 'age': 12, 'grade': 6}
del student['grade']
print(student)

age = student.pop('age')
print(age)
print(student)`},{name:"keys / values / items",summary:"Get the list of keys, values, or (key, value) pairs.",details:`dict.keys() : returns all keys
dict.values() : returns all values
dict.items() : returns all (key, value) pairs`,example:`student = {'name': 'John Doe', 'age': 12, 'grade': 6}
print(list(student.keys()))
print(list(student.values()))
print(list(student.items()))`},{name:"Checking key existence with in",summary:"Use key in dict to test whether a key is present.",details:`The in operator checks the dictionary's keys (not its values).
Checking before access keeps you safe from KeyError.`,example:`student = {'name': 'John Doe', 'age': 12}
print('name' in student)
print('grade' in student)
if 'age' in student:
    print(student['age'])`},{name:"Iterating with for",summary:"Use items() to take both key and value at once.",details:`for k, v in dict.items() : receive key and value together
for k in dict : iterate over keys only (the default)`,example:`student = {'name': 'John Doe', 'age': 12, 'grade': 6}
for key, value in student.items():
    print(f'{key} → {value}')`}]},{id:"set",title:"6. Sets",description:"A collection of values with no duplicates",icon:"join_inner",entries:[{name:"Creating a set",summary:"Make one with curly braces {} or set().",details:`A set does not allow duplicates and has no order.
To create an empty set, use set() — not {} (which makes an empty dictionary).`,example:`s1 = {1, 2, 3, 4}
s2 = set([3, 4, 5, 6])
empty = set()
print(s1)
print(s2)
print(empty)`},{name:"Automatic duplicate removal",summary:"Converting a list to a set removes duplicates.",details:`A set never holds the same value twice, so it is often used to drop duplicates from a list.
Note that the original order is not guaranteed.`,example:`nums = [1, 2, 2, 3, 3, 3, 4]
unique = set(nums)
print(unique)
print(list(unique))`},{name:"add / remove",summary:"add inserts; remove deletes.",details:`add(x) : add x to the set (no change if already present)
remove(x) : remove x (KeyError if missing)
discard(x) : remove x (no error even if missing)`,example:`s = {1, 2, 3}
s.add(4)
s.add(2)
print(s)

s.remove(1)
s.discard(99)
print(s)`},{name:"Union (union, |)",summary:"Combine two sets to gather all elements.",details:"a | b or a.union(b) returns a new set with every element from both sets.",example:`a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)
print(a.union(b))`},{name:"Intersection (intersection, &)",summary:"Keep only elements present in both sets.",details:"a & b or a.intersection(b) returns a new set of elements common to both sets.",example:`a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)
print(a.intersection(b))`},{name:"Difference (difference, -)",summary:"Keep elements that are in a but not in b.",details:"a - b or a.difference(b) returns a new set with the elements of a minus those of b.",example:`a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a - b)
print(b - a)`},{name:"Membership with in",summary:"Use x in s to quickly test whether x is in the set.",details:"in on a set is much faster than on a list (average O(1)). Use sets when frequent lookups matter.",example:`s = {'apple', 'banana', 'grape'}
print('apple' in s)
print('watermelon' in s)`}]},{id:"if",title:"7. Conditionals",description:"Control flow with if / elif / else",icon:"fork_right",entries:[{name:"Basic if",summary:"Run the inner block only when the condition is true.",details:`Python uses indentation to mark blocks (typically 4 spaces).
Put a colon (:) after the condition and indent the next line.`,example:`score = 85
if score >= 60:
    print('Pass')`},{name:"if / else",summary:"Write what should run when the condition is false in else.",details:"If the if condition is False, the else block runs. Exactly one of the two branches runs.",example:`score = 50
if score >= 60:
    print('Pass')
else:
    print('Fail')`},{name:"if / elif / else",summary:"Check several conditions in order from top to bottom.",details:`Only the first branch that becomes true runs; the rest are skipped.
You can chain several elifs, and the final else is optional.`,example:`score = 75
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
else:
    grade = 'F'
print(grade)`},{name:"Comparison operators",summary:"Compare two values with ==, !=, <, <=, >, >=.",details:`== (equal), != (not equal), < (less than), <= (less or equal), > (greater than), >= (greater or equal).
A comparison always evaluates to True or False.`,example:`a = 10
b = 20
print(a == b)
print(a != b)
print(a < b)
print(a <= 10)`},{name:"Logical operators (and, or, not)",summary:"Combine conditions or invert the result.",details:`and : true only if both are true
or  : true if at least one is true
not : flip true/false`,example:`age = 15
score = 85
if age >= 13 and score >= 80:
    print('Assigned to advanced class')

is_holiday = False
if not is_holiday:
    print('Today is a weekday')`},{name:"Nested conditionals",summary:"You can place an if inside another if.",details:`The inner condition is checked only when the outer one is true.
Deep indentation hurts readability, so split things up when nesting gets deep.`,example:`score = 85
attendance = 95
if score >= 60:
    if attendance >= 80:
        print('Pass')
    else:
        print('Attendance too low')
else:
    print('Score too low')`},{name:"Conditional expression (ternary)",summary:"Write A if condition else B on a single line.",details:`A simple if/else can be shortened to one line.
Useful when assigning the result directly to a variable or passing it as a function argument.`,example:`score = 75
result = 'Pass' if score >= 60 else 'Fail'
print(result)

n = -3
abs_n = n if n >= 0 else -n
print(abs_n)`}]},{id:"comprehension",title:"8. List comprehensions",description:"Build lists, dicts, and sets in a single line",icon:"auto_awesome",entries:[{name:"Basic form",summary:"Build a list with [expression for variable in iterable].",details:`You can shorten the loop that fills a list into a single line.
The expression on the left is applied to each element to form the new list.`,example:`# Build with a for loop
squares = []
for i in range(1, 6):
    squares.append(i * i)
print(squares)

# Build with a comprehension (same result)
squares2 = [i * i for i in range(1, 6)]
print(squares2)`},{name:"Conditional filter",summary:"Append an if to keep only the elements you want.",details:"[expression for variable in iterable if condition] — only elements that satisfy the condition pass through.",example:`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [n for n in nums if n % 2 == 0]
print(evens)

words = ['apple', 'banana', 'cherry', 'kiwi']
short = [w for w in words if len(w) <= 5]
print(short)`},{name:"if-else inside the expression",summary:"An if-else inside the expression transforms every element.",details:`A trailing if (filter) and an if-else inside the expression sit in different positions.
An if-else inside the expression keeps every element but changes the value.`,example:`nums = [1, 2, 3, 4, 5]
labels = ['even' if n % 2 == 0 else 'odd' for n in nums]
print(labels)`},{name:"Nested comprehension",summary:"Use two for clauses to build 2D data.",details:`With two for clauses, the outer for runs first and the inner for runs inside it.
Often used to build nested lists (matrices) or to flatten them.`,example:`# Multiplication tables 2 to 4
table = [[i, j, i * j] for i in range(2, 5) for j in range(1, 4)]
for row in table:
    print(row)`},{name:"Dict comprehension",summary:"Build a dictionary with {key: value for ...}.",details:`Same syntax as a list comprehension, but separate key and value with a colon (:).
Often combined with zip to build a dictionary from two parallel lists.`,example:`squares = {n: n * n for n in range(1, 6)}
print(squares)

names = ['John Doe', 'Jane Roe', 'Mary Jane']
ages = [12, 13, 11]
people = {n: a for n, a in zip(names, ages)}
print(people)`},{name:"Set comprehension",summary:"Build a set with {expression for ...} (duplicates removed automatically).",details:`Use curly braces {} instead of square brackets, and if it is not key:value form, it is a set comprehension.
Duplicates in the result are automatically reduced to one.`,example:`nums = [1, 2, 2, 3, 3, 3, 4]
unique_squares = {n * n for n in nums}
print(unique_squares)`}]},{id:"loop",title:"9. Loops",description:"Iterate with for and while",icon:"loop",entries:[{name:"for + range",summary:"range(n) repeats n times, from 0 to n-1.",details:`range(n) generates the integers from 0 to n-1 in order.
For a fixed number of repetitions, for + range is the most natural choice.`,example:`for i in range(5):
    print(i)

print('---')
for i in range(3):
    print('hello')`},{name:"range start / stop / step",summary:"Use range(start, stop, step) to control range and step.",details:`range(a, b)    : from a through b-1
range(a, b, s) : from a through b-1 in steps of s
A negative step iterates in reverse order.`,example:`for i in range(1, 6):
    print(i)

print('---')
for i in range(0, 10, 2):
    print(i)

print('---')
for i in range(10, 0, -1):
    print(i)`},{name:"Iterating lists / strings",summary:"Pass a collection straight to for to take elements one by one.",details:`Lists, tuples, strings, sets, and dictionaries (keys) can all be passed to for directly.
When you do not need the index, this is more concise and faster.`,example:`fruits = ['apple', 'banana', 'grape']
for f in fruits:
    print(f)

print('---')
for ch in 'Python':
    print(ch)`},{name:"while basics",summary:"Repeat as long as the condition is true.",details:`Use while when the number of iterations is not known in advance.
If you do not change the condition inside the loop, you fall into an infinite loop, so be careful.`,example:`n = 1
total = 0
while n <= 10:
    total += n
    n += 1
print(total)`},{name:"break",summary:"When break is reached, the loop ends immediately.",details:`Use break when no more iterations are needed once a condition is met.
Only the innermost loop is exited.`,example:`for i in range(1, 100):
    if i * i > 50:
        print('First value whose square exceeds 50:', i)
        break`},{name:"continue",summary:"continue skips this iteration only and moves on.",details:`Unlike break, which ends the loop, continue skips just one iteration.
Use it to exclude certain values from processing.`,example:`for i in range(1, 11):
    if i % 2 == 0:
        continue
    print(i)`},{name:"enumerate",summary:"Iterate while taking both index and value.",details:`enumerate(list) yields (index, value) pairs in order.
You no longer need to maintain i yourself in loops that need an index.`,example:`fruits = ['apple', 'banana', 'grape']
for i, f in enumerate(fruits):
    print(i, f)

# Start numbering from 1
for i, f in enumerate(fruits, start=1):
    print(i, f)`},{name:"zip",summary:"Iterate several lists in parallel by pairing them up.",details:`zip(a, b) pairs elements at the same index into (a[i], b[i]) tuples.
When lengths differ, it stops at the shorter one.`,example:`names = ['John Doe', 'Jane Roe', 'Mary Jane']
scores = [88, 92, 76]
for n, s in zip(names, scores):
    print(f'{n}: {s} points')`}]},{id:"function",title:"10. Functions",description:"Defining functions, returning, and passing parameters",icon:"functions",entries:[{name:"Defining a function (def)",summary:"Define a function with the form def name(parameters):.",details:`A function is a named bundle of code.
When the same processing is needed many times, wrapping it in a function lets you reuse it with a single call.
After def, write the function name, parameters in parentheses, a colon (:) at the end, and indent the next line.`,example:`def greet():
    print('Hello!')

# Calling the function
greet()
greet()`},{name:"Parameters and arguments",summary:"Variable names in the parentheses receive values to process.",details:`Parameter: a variable name written inside the parentheses of a function definition
Argument: the actual value passed when the function is called
Multiple parameters are separated by commas; values are passed in the same order at call time (positional arguments).`,example:`def add(a, b):
    print(f'{a} + {b} = {a + b}')

add(3, 5)
add(10, 20)`},{name:"Return value (return)",summary:"Return a result with return.",details:`The value after return is sent back as the function's result.
When return is reached, the function ends immediately (any lines below are skipped).
If you do not write return, or write return with no value, None is returned.`,example:`def square(x):
    return x * x

result = square(5)
print(result)
print(square(7) + square(3))`},{name:"Returning multiple values",summary:"Listing multiple values after return packs them into a tuple.",details:`On the receiving side you can take them with several variables at once (unpacking).
Receive into a single variable and you get one tuple.`,example:`def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5, 9, 2, 6])
print(lo, hi)

result = min_max([10, 20, 30])
print(result)`},{name:"Default parameters",summary:"Give a parameter a default value so it can be omitted at call time.",details:`With def f(x, y=10), you can call without passing y.
Parameters with defaults must come after parameters without defaults.`,example:`def greet(name, message='Hello'):
    print(f'{name}, {message}!')

greet('John Doe')
greet('Jane Roe', 'Nice to meet you')`},{name:"Keyword arguments",summary:"At call time you can pass values by name with parameter=value.",details:`With keyword arguments you do not need to remember the order of parameters, and the code reads more clearly.
When mixing positional and keyword arguments, write the positional ones first.`,example:`def make_user(name, age, city):
    print(f'{name} ({age} years, {city})')

make_user(name='John Doe', age=12, city='Seoul')
make_user('Jane Roe', city='Busan', age=13)`},{name:"Variable positional arguments (*args)",summary:"A parameter prefixed with * collects an arbitrary number of positional arguments into a tuple.",details:`Use *args when you cannot tell in advance how many arguments will be passed.
The name args is just a convention; another name works, but args is conventional.`,example:`def total(*nums):
    print('Received:', nums)
    return sum(nums)

print(total(1, 2, 3))
print(total(10, 20, 30, 40, 50))`},{name:"Variable keyword arguments (**kwargs)",summary:"A parameter prefixed with ** collects an arbitrary number of keyword arguments into a dict.",details:`Use **kwargs when you want to accept any number of key=value arguments freely.
Inside the function, treat it like a regular dictionary.
You can use *args and **kwargs together (order: regular, *args, **kwargs).`,example:`def show_info(**info):
    for key, value in info.items():
        print(f'{key}: {value}')

show_info(name='John Doe', age=12, city='Seoul')`},{name:"lambda (one-line anonymous function)",summary:"Create a short function in one line with the form lambda parameters: expression.",details:`Use it to make a small unnamed function whose body is a single expression.
Often used where a function is passed as an argument, like sorted, map, filter.`,example:`# Same effect as a regular def
double = lambda x: x * 2
print(double(5))

# As the sort key for sorted
words = ['banana', 'apple', 'kiwi']
print(sorted(words, key=lambda w: len(w)))

# With map
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda n: n * n, nums))
print(squares)`},{name:"Variable scope (local / global)",summary:"A variable created inside a function is not visible outside it.",details:`A variable created inside a function is a local variable and disappears when the function ends.
A variable created outside a function is a global variable and can be read inside the function.
To change a global variable inside a function, declare it with the global keyword.`,example:`count = 0  # Global variable

def show_local():
    msg = 'Hello'  # Local variable
    print(msg)
    print(count)  # Global variable can be read

def increase():
    global count
    count += 1

show_local()
increase()
increase()
print('count =', count)`}]},{id:"examples",title:"11. Examples",description:"Five practice examples using what you have learned so far",icon:"lightbulb",entries:[{name:"Even/odd checker",summary:"Use a variable and a conditional to check whether a number is even or odd.",details:`The remainder operator % returns the remainder of dividing two numbers.
If an integer divided by 2 has a remainder of 0, it is even; otherwise it is odd.

This is the most basic pattern combining if / else with the comparison operator ==.
Try changing the value of n and see how the result changes.`,example:`# Even/odd checker
n = 7

if n % 2 == 0:
    print(f'{n} is even.')
else:
    print(f'{n} is odd.')`},{name:"Print a multiplication table",summary:"Use for and range to print a chosen multiplication table at once.",details:`Store the table you want in the dan variable, and use range(1, 10) to repeat 9 times from 1 to 9.
While the loop variable i changes through 1, 2, 3 ... 9, compute and print dan * i.

Inside f-string braces {}, you can write not only variables but also expressions like dan * i.
Try changing dan to other numbers between 2 and 9 to print other tables.`,example:`# Print a multiplication table
dan = 7

for i in range(1, 10):
    print(f'{dan} x {i} = {dan * i}')`},{name:"List average",summary:"Compute an average using a list and the built-in functions sum and len.",details:`sum(list) returns the total of all elements; len(list) returns the number of elements.
The average is sum / count, so it can be calculated as sum(scores) / len(scores).

Wrapping the same operation in a function with def lets you reuse it for any list of numbers.
Function parameter names are typically generic, like nums.`,example:`# List average
def average(nums):
    return sum(nums) / len(nums)

scores = [88, 92, 76, 81, 95]
avg = average(scores)
print(f'scores: {scores}')
print(f'average: {avg}')`},{name:"Draw a star pyramid",summary:"Use loops and string multiplication (*) to make a star shape.",details:`string * integer repeats the string that many times. e.g., "*" * 3  →  "***"
Use for and range to print stars in increasing counts of 1, 2, 3 ..., and you get a pyramid.

Note that range(1, height + 1) makes i go from 1 up to height.
Try changing height to 5, 7, 10, etc., and compare the resulting shapes.`,example:`# Draw a star pyramid
height = 5

for i in range(1, height + 1):
    print('*' * i)`},{name:"Palindrome check",summary:"Reverse with slicing [::-1] and compare to the original to test for a palindrome.",details:`A palindrome is a string that reads the same backward, like "level" or "racecar".
Slicing s[::-1] takes characters from the end one by one, reversing the string.
If the reversed result equals the original, it is a palindrome; otherwise it is not.

The result of an == comparison is True or False, so you can return it directly.
Wrapping it in a function lets you check any string in one line.`,example:`# Palindrome check
def is_palindrome(s):
    return s == s[::-1]

print(is_palindrome('level'))
print(is_palindrome('python'))
print(is_palindrome('racecar'))
print(is_palindrome('hello'))`}]}];export{e as PYTHON_TUTORIAL};
