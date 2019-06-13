import EventSource from "eventsourcemock";
import { sources } from "eventsourcemock";
import { shallowMount } from "@vue/test-utils";
import MockDate from "mockdate";
import Container from "./Container";

describe("<Container />", () => {
  beforeEach(() => {
    global.BASE_PATH = "";
    global.EventSource = EventSource;
  });

  afterEach(() => MockDate.reset());

  test("is a Vue instance", async () => {
    const wrapper = shallowMount(Container);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("renders correctly", async () => {
    const wrapper = shallowMount(Container);
    expect(wrapper.element).toMatchSnapshot();
  });

  test("should connect to EventSource", async () => {
    shallowMount(Container, {
      propsData: { id: "abc" }
    });
    sources["/api/logs/stream?id=abc"].emitOpen();
    expect(sources["/api/logs/stream?id=abc"].readyState).toBe(1);
  });

  test("should close EventSource", async () => {
    const wrapper = shallowMount(Container, {
      propsData: { id: "abc" }
    });
    sources["/api/logs/stream?id=abc"].emitOpen();
    wrapper.destroy();
    expect(sources["/api/logs/stream?id=abc"].readyState).toBe(2);
  });

  test("should parse messages", async () => {
    MockDate.set("6/12/2019");
    const wrapper = shallowMount(Container, {
      propsData: { id: "abc" }
    });
    sources["/api/logs/stream?id=abc"].emitOpen();
    sources["/api/logs/stream?id=abc"].emitMessage({ data: `2019-06-13T00:55:42.459034602Z "This is a message."` });
    const [message, _] = wrapper.vm.messages;

    expect(message).toMatchInlineSnapshot(`
            Object {
              "date": 2019-06-13T00:55:42.459Z,
              "dateRelative": "today at 5:55 PM",
              "key": 0,
              "message": " \\"This is a message.\\"",
            }
        `);
  });

  test("should render messages", async () => {
    MockDate.set("6/12/2019");
    const wrapper = shallowMount(Container, {
      propsData: { id: "abc" }
    });
    sources["/api/logs/stream?id=abc"].emitOpen();
    sources["/api/logs/stream?id=abc"].emitMessage({ data: `2019-06-13T00:55:42.459034602Z "This is a message."` });

    expect(wrapper.find("ul.events")).toMatchInlineSnapshot(`
      <ul class="events">
        <li class="event"><span class="date">today at 5:55 PM</span> <span class="text"> "This is a message."</span></li>
      </ul>
    `);
  });
});
