# react-native-progress-seekbar
A draggable progress with seekbar , just like the seekbar in android.

<img src="https://github.com/xwh817/ReactNativeStepByStep/blob/master/screenShot/seekBar.gif">


## Example

```tsx


	<SeekBar style={{margin: 20, padding: 20, backgroundColor: 'black'}}
		 min={0}
		 max={100}
		 progress={value} // number
		 progressHeight={4}
		 progressBackgroundColor='#663300'
		 progressColor='#88cc33'
		 thumbSize={40}
		 thumbColor='#88cc33'
		 thumbColorPressed='#ff6633'
		 onStartTouch={(progress) => {console.log('onStartTouch: ' + progress)}}
		 onProgressChanged={(progress) => console.log('onProgressChanged: ' + progress)}
		 onStopTouch={(progress) => {console.log('onStopTouch: ' + progress)}}
	/>



```
