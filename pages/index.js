import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever, MdModeEdit, MdCancel } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { BiCheck } from "react-icons/bi";

import { useAuth } from "@/firebase/auth";
import Loader from "@/components/Loader";

import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);

  const { authUser, isLoading, signOut } = useAuth();
  const router = useRouter();

  const fetchTodos = useCallback(async () => {
    try {
      if (!authUser || !authUser.uid) {
        // Check if authUser or authUser.uid is undefined
        return;
      }
      const q = query(
        collection(db, "todos"),
        where("owner", "==", authUser.uid)
      );

      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  }, [authUser]);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    }

    if (!!authUser) {
      fetchTodos(authUser.uid);
    }
  }, [authUser, isLoading, router, fetchTodos]);

  // Create Todo
  const addTodo = async () => {
    if (todoInput.trim() === "") {
      // Check if todoInput is blank or only contains whitespace
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "todos"), {
        owner: authUser.uid,
        content: todoInput,
        completed: false,
      });

      console.log("Document written with ID: ", docRef.id);
      fetchTodos(authUser.uid);
      setTodoInput("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Delete Todo
  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, "todos", docId));
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Mark As Completed Todo
  const markAsCompletedHandler = async (event, docId) => {
    try {
      const docRef = doc(db, "todos", docId);
      await updateDoc(docRef, {
        completed: event.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Edit Todo
  const editTodo = (todoId) => {
    setEditTodoId(todoId);
  };

  // Handle Todo Input Change
  const handleTodoInputChange = (e, todo) => {
    const updatedTodos = todos.map((item) => {
      if (item.id === todo.id) {
        return { ...item, content: e.target.value };
      }
      return item;
    });
    setTodos(updatedTodos);
  };

  // Save Todo Edit
  const saveTodoEdit = async (todoId) => {
    try {
      const todo = todos.find((item) => item.id === todoId);
      if (todo) {
        const docRef = doc(db, "todos", todoId);
        await updateDoc(docRef, {
          content: todo.content,
        });
        setEditTodoId(null);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditTodoId(null);
  };

  // After Pressing Enter the todo should add
  const onKeyUp = (event) => {
    if (event.key === "Enter" && todoInput.length > 0) {
      addTodo();
    }
  };

  return !authUser ? (
    <Loader />
  ) : (
    <main className="relative mx-3">
      <div
        className="bg-[#ffc788] text-black w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] hover:text-white active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={signOut}
      >
        <GoSignOut size={18} />
        <span title="Logout">Logout</span>
      </div>

      <div className="max-w-4xl mx-auto my-10 p-12 rounded-[14px] md:rounded-[25px] bg-white shadow-lg">
        <div className="z-10 p-3 -m-6">
          {/* Heading Starting*/}
          <div className="border bg-white flex items-center justify-center rounded-[14px] md:rounded-[25px] p-5 gap-2">
            <span className="md:text-5xl text-3xl">📝</span>
            <h1 className="md:text-5xl text-3xl font-bold">To-Doodles</h1>
          </div>
          {/* Heading Ending  */}

          {/* Todo Input and Button Start  */}
          <div className="relative flex items-center justify-center gap-2 mt-5 bg-transparent">
            <input
              type="text"
              placeholder={`🤔 What's the plan for today, ${authUser.userName}?`}
              className="font-semibold text-[17px] placeholder:text-gray-500 border outline-none grow shadow-sm rounded-[14px] md:rounded-[25px] px-7 py-4 focus-visible:shadow-md focus:border-[#ffc788] transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyUp={onKeyUp}
            />

            <button
              className="absolute right-4 p-2 rounded-[24px] bg-[#ffc788] flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8] active:scale-90"
              onClick={addTodo}
            >
              <AiOutlinePlus size={20} className="text-black" />
            </button>
          </div>
          {/* Todo Input and Button End*/}

          {/* To do List Start */}
          <div className="border my-7 rounded-[14px] md:rounded-[25px] p-5 h-[500px] overflow-y-scroll my-scrollbar">
            {todos.length > 0 ? (
              todos.map((todo, index) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between border mb-4 p-4 rounded-[14px] md:rounded-[25px]"
                >
                  {editTodoId === todo.id ? (
                    <>
                      <input
                        type="text"
                        className=" w-full py-1 border-b outline-none"
                        value={todo.content}
                        onChange={(e) => handleTodoInputChange(e, todo)}
                      />
                      <div className="flex gap-2">
                        <button
                          className="p-1 rounded-[14px] md:rounded-[25px] border border-slate-500 text-black focus:outline-none focus-visible:ring  transition-all duration-300"
                          onClick={() => saveTodoEdit(todo.id)}
                        >
                          <BiCheck size={18} />
                        </button>
                        <button
                          className="p-1 rounded-[14px] md:rounded-[25px] border border-slate-500 text-black focus:outline-none focus-visible:ring  transition-all duration-300"
                          onClick={cancelEdit}
                        >
                          <MdCancel size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={(e) => markAsCompletedHandler(e, todo.id)}
                          className="form-checkbox rounded-[14px] md:rounded-[25px]"
                        />
                        <span
                          className={`font-medium text-[18px] ${
                            todo.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {todo.content}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          className="p-1 rounded-[14px] md:rounded-[25px]  text-black focus:outline-none focus-visible:ring transition-all duration-300 border border-slate-500"
                          onClick={() => editTodo(todo.id)}
                        >
                          <MdModeEdit size={18} />
                        </button>
                        <button
                          className="p-1 rounded-[14px] md:rounded-[25px]  text-black focus:outline-none focus-visible:ring transition-all duration-300 border border-slate-500"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <MdDeleteForever size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-bold text-center text-gray-500">
                {`The to-do list is feeling a bit lonely 🥺. Help it out and add a new friend!`}
              </div>
            )}
          </div>
          {/* To do List End */}
        </div>
      </div>
    </main>
  );
}
