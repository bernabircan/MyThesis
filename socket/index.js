const io = require("socket.io")(8900, {
  cors: {
      origin: "http://localhost:3000",
  },

});

let users = [];
let usersIdList = [];
//aynı user her sayfayı yenilediğinde diziye atmaması
//1 kere atması için funct

const addUser = (userId, socketId) => { 
  !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  
  !usersIdList.some((u) => u === userId) &&
      usersIdList.push( userId);
     // console.log("adduser  users",users);
      //console.log("adduser usersIdList",usersIdList);
};

const removeUser = (socketId) => { //kullanıcı logout oldduğunda yani disconnect durumunda listeden o kullanıcıyı çıkarıcaz
  users = users.filter((user) => user.socketId !== socketId);
  usersIdList = usersIdList.filter((f) => users.some((u) => u.userId === f))
  //console.log("removeuser users",users);
  //console.log("removeuser usersIdList",usersIdList);

 
};

const getUser = (userId) => {
  
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on("addUser", (userId) => {  //clienttan gelen isteği aldı. 2
      addUser(userId, socket.id); //kullanıcıyı users listesine ekledi.
     
     io.emit("getUsers",usersIdList); //clientta bulunan her kullanıcıya users listesini gönderiyoz. 3

  });
  
  socket.on("getOnlineUsers",()=> {  
    
   
   io.emit("getUsers",usersIdList); //clientta bulunan her kullanıcıya users listesini gönderiyoz. 3

});
  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId,conversationId, text }) => { //serverdan gelene mesajı alıyom  -mesaj göndermek 2
      const user = getUser(receiverId);
      //console.log(user);
      //console.log(senderId);
      //console.log(text);
      
      io.to(user.socketId).emit("getMessage", { //mesajı göndereceğim kişinin socket ıdı ile sadece o kişiye mesajı gönderme isteği -mesaj göndermek 3
          senderId,
          conversationId,
          text,
      });
      
  });

  socket.on("sendNotification", ({ receiverId }) => {
    const receiver = getUser(receiverId );
    io.to(receiver.socketId).emit("getNotification", {
      receiverId,
    });
  });

 

  //when disconnect
  socket.on("disconnect", () => { // clienttan istek geldiğinde online olmayan kullanıcıları users listesinde çıkarıyoruz -kullanıcı cıkar 1
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", usersIdList); //clienta remove edilmiş online users listesini atıyoz. -kullanıcı cıkar 2
  });

});