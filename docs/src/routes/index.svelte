<script lang="ts">
	import { newForm } from 'manzana';

	const { initialValues, values } = newForm({
		initialValues: {
			name: 'Esteban',
			email: 'hello@estebanborai.com'
		}
	});
</script>

<div id="container">
	<section>
		<h1>Hello {$values.name || ''}</h1>
		<h3>I will send you an email to: {$values.email || ''}</h3>

		<form action="" method="get" class="form-example">
			<div class="form-example">
				<label for="name">Enter your name: </label>
				<input type="text" name="name" id="name" required bind:value={$values.name} />
			</div>
			<div class="form-example">
				<label for="email">Enter your email: </label>
				<input type="email" name="email" id="email" required bind:value={$values.email} />
			</div>
			<div class="form-example">
				<label for="age">Enter your age: </label>
				<input type="number" name="age" id="age" required bind:value={$values.age} />
			</div>
			<div class="form-example">
				<input type="submit" value="Subscribe!" />
			</div>
		</form>
	</section>
	<section>
		<code>
			Initial Values:
			<br />
			<pre>
{JSON.stringify($initialValues, undefined, 2)}
</pre>
		</code>
		<br /><br />
		<code>
			Values:
			<br />
			<pre>
{JSON.stringify($values, undefined, 2)}
</pre>
		</code>
	</section>
</div>

<style>
	#container {
		display: flex;
	}

	#container section {
		width: 50%;
	}

  #container section:last-of-type {
    background-color: #fafafa;
    box-sizing: border-box;
    padding: 1rem;
  }

  #container section:last-of-type pre {
    color: #aa0000;
  }
</style>
