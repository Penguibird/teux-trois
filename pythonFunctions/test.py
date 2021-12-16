import gkeepapi


keep = gkeepapi.Keep()
success = keep.login("coronacraftvanoce@gmail.com", "minecraftCorona1234")

note = keep.createNote('Todo', 'Eat breakfast')
note.pinned = True
note.color = gkeepapi.node.ColorValue.Red
keep.sync()

print(success)