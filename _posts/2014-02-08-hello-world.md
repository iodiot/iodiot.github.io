---
layout: post
title: "Hello world"
quote: 
image: false
video: false
---

Hello world...
Hello world...
Hello world...
Hello world...
Hello world...
Hello world...
Hello world...

{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}

{% highlight python %}
def factorial(n):
	if n <= 1: return 1
	elif: return n * factorial(n - 1)

factorial(10)
{% endhighlight %}