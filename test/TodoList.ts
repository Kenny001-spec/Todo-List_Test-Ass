import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("TodoList Test", function () {
  //Reusable async method for deployment
  async function deployTodoListFix() {
    //Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const TodoList = await hre.ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();

    return { todoList, owner, otherAccount };
  }

  describe("deployment", () => {
    it("Should check if it deployed", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFix);

      expect(await todoList.owner()).to.equal(owner);
    });

    it("Should be able to create list as the owner", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFix);
      const title = "Eat after my class";
      const description = "To defend my project";
      await todoList.connect(owner).createTodo(title, description);

      const index = 0;
      const allTodos = await todoList.getAllTodo();
      const currentTodo = allTodos[index];

      const [currentTitle, currentDescription] = currentTodo;

      expect(currentTitle).to.equal(title);
      expect(currentDescription).to.equal(description);
    });

    it("Should not be able to create todolist if not the owner", async function () {
      const { todoList, otherAccount } = await loadFixture(deployTodoListFix);
      const title = "To check if you are not the owner";
      const description = "Only the contract owner can create a todo item";

      await expect(
        todoList.connect(otherAccount).createTodo(title, description)
      ).to.be.revertedWith("You're not allowed");
    });

    it("Should be able to get a single to do list", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFix);

      const index = 0;
      const taskTitle = "Get out of the class";
      const taskDescription = "Create a simple script to print 'Hello World";

      await todoList.connect(owner).createTodo(taskTitle, taskDescription);

      const [retrievedTitle, retrievedDescription, todoIndex] =
        await todoList.getTodo(index);

      expect(retrievedTitle).to.equal(taskTitle);
      expect(retrievedDescription).to.equal(taskDescription);
      expect(todoIndex).to.equal(1);
    });

    it("Should be able to update todo list as the Owner", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFix);

      const title1 = "It is good to code";
      const description1 =
        "I must always code 15hrs a day so I can improve my skill";

      await todoList.connect(owner).createTodo(title1, description1);

      const title = "try to code";
      const description =
        "code is life";

      await todoList.connect(owner).updateTodo(0, title, description);

      expect(await todoList.getTodo(0)).to.deep.equal([title, description, 2]);
    });
  });
});
