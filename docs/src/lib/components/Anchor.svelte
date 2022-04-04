<script lang="ts">
  export let href: string;
  export let target: string = '_blank';
</script>

<a {href} {target} class="text-blue-400 underline">
  <slot />
</a>
