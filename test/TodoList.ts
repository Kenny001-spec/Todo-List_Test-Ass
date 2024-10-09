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
        const description = "Only the contract owner can create a todo item. You are not permitted.";
  
        await expect(
          todoList.connect(otherAccount).createTodo(title, description)
        ).to.be.revertedWith("You are not allowed");
      });
  });
});
