import { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";

export default function Home() {
	const [message, setMessage] = useState("");
	const [chatHistory, setChatHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const chatHistoryEndRef = useRef(null);

	// Scroll to the bottom of chatHistory
	useEffect(() => {
		chatHistoryEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatHistory]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const msg = message;
		setMessage("");

		setChatHistory((prev) => [...prev, { user: msg }]);
		setLoading(true);

		const res = await fetch("/api/gemini", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: msg}),
		});

		const data = await res.json();
		setLoading(false);
		setChatHistory((prev) => [...prev, { bot: data.response }]);
	};

	return (
		<div className={styles.container}>
		<div className={styles.chatContainer}>
			<div className={styles.chatHistory}>
			{chatHistory.map((chat, index) => (
				<div
					key={index}
					className={chat.user ? styles.userMessage : styles.botMessage}
				>
					{chat.user && <strong>User:</strong>} {chat.user}
					{chat.bot && <strong>Bot:</strong>} {chat.bot}
				</div>
			))}
			{loading && <div className={styles.botMessage}>{"..."} </div>}
			<div ref={chatHistoryEndRef} /></div>

			<form className={styles.chatInputForm} onSubmit={handleSubmit}>
			<input
				type="text"
				className={styles.chatInput}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message..."
				required
			/>
			<button type="submit" className={styles.sendButton}>Send</button>
			</form>
		</div>
		</div>
	);
}
