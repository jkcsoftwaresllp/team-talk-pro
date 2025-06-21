import React,{useEffect,useState} from "react";
import io from 'socket.io-client';
const socket =io('http://localhost:5000',{
    withCredentials:true
});
const ChatPage=({currentUser,selectedChat})=>{
    const[messages,setMessages]=useState([]);
    const[newMsg,setMsg]=useState('');
    useEffect(()=>{
        socket.emit('join_chat',{userId: currentUser.id,chatId:selectedChat.id});
        socket.on('receive_message',(msg)=>{
            setMessages((prev)=>[...prev,msg]);
        });
        return ()=> socket.off('receive_message');

    },[selectedChat.id]);
    const handleSend=()=>{
        const message={
            chatId:selectedChat.id,
            senderId:currentUser.id,
            content:newMsg,
        };
        socket.emit('send_message',message);
        setNewMsg('');
    };
    return(
        <div>
            <h2>{selectedChat.name}</h2>
            <div style={{ height: '300px', overflowY: 'auto' }}>
            {messages.map((msg)=>(
                <p key={msg.id}><strong>{msg.senerId}</strong>:{msg.content}</p>
            ))}
                </div> 
                <input
                value={newMsg}
                onChange={(e)=>setNewMsg(e.target.value)}
                placeholder="type a message"
                />
                <button onClick={handleSend}>Send</button> 
        </div>
    );

};
export default ChatPage;