declare module "*.vue" {
    import { defineComponent } from "@vue/compiler-core";
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
}