<script lang="ts">
	import { newForm } from 'manzana';
	import * as Yup from 'yup';

	const { initialValues, handleChange, values, errors } = newForm({
		initialValues: {
			name: 'Esteban',
			email: 'hello@estebanborai.com'
		},
		validateOnChange: true,
		validationSchema: Yup.object({
			name: Yup.string()
				.required('You must specify your name.')
				.min(3, 'Your name must have at least 3 character of length'),
			email: Yup.string()
				.required('You must specify an email.')
				.email('This is not a valid email!'),
			age: Yup.number()
				.required('You must specify your age.')
				.moreThan(18, 'You must be 18 years old to signup!')
		})
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
				<span>{$errors.name}</span>
			</div>
			<div class="form-example">
				<label for="email">Enter your email: </label>
				<input
					type="email"
					name="email"
					id="email"
					required
					value={$values.email}
					on:change={handleChange}
				/>
				<span>{$errors.email}</span>
			</div>
			<div class="form-example">
				<label for="age">Enter your age: </label>
				<input type="number" name="age" id="age" required bind:value={$values.age} />
				<span>{$errors.age}</span>
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
{JSON.stringify(initialValues, undefined, 2)}
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
		<code>
			Errors:
			<br />
			<pre>
{JSON.stringify($errors, undefined, 2)}
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
