class ChatGPTAuto {
  constructor() {
    this.intervalId = setInterval(() => {
      try {
        const div = this.getLastTextBaseDiv();
        const code = this.getLastCodeFromDiv(div);

        if (code && !div.executed) {
          this.executeStatement(code.textContent);
          div.executed = true;
        }
      } catch(e) {
        console.error('error: ', e);
        this.stop();
      }
    }, 1000);
  }

  run(){
    this.executeStatement("return chatGPTAuto.instructions('one')");
  }

  instructions(step){
    this.step = step;

    return {
      one: "Do you write javascript? Please, repeate this like a javascript statement [return chatGPTAuto.instructions('two');]",
      two: "Nice! Please, repeate this like a javascript statement [return chatGPTAuto.instructions('three')] after you analyse this class code [" + ChatGPT.toString() + "; let chatGPTAuto = new ChatGPT();" + "]",
      three: "Nice! Whenever you write it as a javascript statement I will copy it and run it, then respond with its return, so always write a functional statement and avoid the indefinite return. Please answer me correctly with an 'alert' if you understand how this works!"
    }[step];
  }

  stop() {
    clearInterval(this.intervalId);
    console.log('stopped');
  }

  getLastTextBaseDiv() {
    const divs = document.querySelectorAll('div.text-base:not(:has(img))');
    const div = divs[divs.length - 1];

    if (div && this.existsButtonRegenerateResponse()) {
      return div;
    }
  }

  existsButtonRegenerateResponse() {
    const buttons = document.getElementsByTagName('button');

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].innerText === 'Regenerate response') {
        return true
      }
    }
  }

  getLastCodeFromDiv(div) {
    if (!div)
      return null;

    const codes = div.querySelectorAll('code.hljs');
    return codes[codes.length - 1];
  }

  getTextarea() {
    return document.querySelector('div.absolute form textarea');
  }

  setTextareaValue(value) {
    if (this.step === 'three') {
      this.step = null;
    } else if(!this.step) {
      value = 'Nice! Your statement returned: ' + JSON.stringify(value);
    }

    setTimeout(() => {
      this.getTextarea().value = value;
    }, 1000);
  }

  submitTextarea() {
    setTimeout(() => {
      this.getTextarea().dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
        bubbles: true,
        cancelable: true
      }));
    }, 1000);
  }

  async executeStatement(statement) {
    console.log('executing: ' + statement);

    try {
      const result = await new Function(statement)();
      this.setTextareaValue(result);
    } catch (e) {
      this.setTextareaValue(e.toString());
    }

    this.submitTextarea();
  }
}

const chatGPTAuto = new ChatGPTAuto();
chatGPTAuto.run();
