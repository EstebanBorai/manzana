<script lang="ts">
  import { newForm } from 'manzana';
  import * as Yup from 'yup';

  let valuesSubmitted = null;

  const { errors, handleSubmit, isSubmitting, isValidating, values } = newForm({
    initialValues: {
      sender: '',
      receiver: '',
      message: ''
    },
    validationSchema: Yup.object({
      sender: Yup.string().email().required(),
      receiver: Yup.string().email().required(),
      message: Yup.string().required()
    }),
    onSubmit(values) {
      valuesSubmitted = values;
    }
  });
</script>

<section class="grid gap-4 grid-cols-2 my-4">
  <form on:submit={handleSubmit}>
    <!-- Sender Input -->
    <div class="flex flex-col space-y-2">
      <label for="sender" class="text-gray-700 select-none font-medium"
        >Sender</label
      >
      <input
        id="sender"
        type="text"
        name="sender"
        placeholder="john@applebees.com"
        class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        bind:value={$values.sender}
      />
      <p class="text-red-400" class:opacity-0={!$errors.sender}>
        {$errors.sender}
      </p>
    </div>
    <!-- Receiver Input -->
    <div class="flex flex-col space-y-2">
      <label for="receiver" class="text-gray-700 select-none font-medium"
        >Receiver</label
      >
      <input
        id="receiver"
        type="text"
        name="receiver"
        placeholder="john@applebees.com"
        class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        bind:value={$values.receiver}
      />
      <p class="text-red-400" class:opacity-0={!$errors.receiver}>
        {$errors.receiver}
      </p>
    </div>
    <!-- Message Input -->
    <div class="flex flex-col space-y-2">
      <label for="message">Message</label>
      <textarea
        class="resize-none px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        placeholder="Howdy John!..."
        bind:value={$values.message}
      />
      <p class="text-red-400" class:opacity-0={!$errors.message}>
        {$errors.message}
      </p>
    </div>
    <button
      type="submit"
      class="px-4 py-2 my-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >Send</button
    >
  </form>
  <div class="flex flex-col justify-start border rounded p-4">
    <article class="flex flex-col justify-start">
      <strong>Values</strong>
      <pre><code class="bg-transparent overflow-auto"
          >{JSON.stringify($values, undefined, 2)}</code
        ></pre>
    </article>
    <article class="flex flex-col justify-start">
      <strong>Errors</strong>
      <pre><code class="bg-transparent overflow-auto"
          >{JSON.stringify($errors, undefined, 2)}</code
        ></pre>
    </article>
    <article class="flex flex-col justify-start">
      <strong>Values Submitted</strong>
      <pre><code class="bg-transparent overflow-auto"
          >{JSON.stringify(valuesSubmitted, undefined, 2)}</code
        ></pre>
    </article>
    <article class="flex items-center">
      <strong>Submitting: </strong>
      <span>
        {#if $isSubmitting}
          🟢
        {:else}
          🔴
        {/if}
      </span>
    </article>
    <article class="flex items-center">
      <strong>Validating: </strong>
      <span>
        {#if $isValidating}
          🟢
        {:else}
          🔴
        {/if}
      </span>
    </article>
  </div>
</section>
