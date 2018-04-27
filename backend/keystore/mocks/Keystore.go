// Code generated by mockery v1.0.0
package mocks

import coin "github.com/shiftdevices/godbb/backend/coins/coin"
import hdkeychain "github.com/btcsuite/btcutil/hdkeychain"

import mock "github.com/stretchr/testify/mock"
import signing "github.com/shiftdevices/godbb/backend/signing"

// Keystore is an autogenerated mock type for the Keystore type
type Keystore struct {
	mock.Mock
}

// Configuration provides a mock function with given fields:
func (_m *Keystore) Configuration() *signing.Configuration {
	ret := _m.Called()

	var r0 *signing.Configuration
	if rf, ok := ret.Get(0).(func() *signing.Configuration); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*signing.Configuration)
		}
	}

	return r0
}

// CosignerIndex provides a mock function with given fields:
func (_m *Keystore) CosignerIndex() int {
	ret := _m.Called()

	var r0 int
	if rf, ok := ret.Get(0).(func() int); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(int)
	}

	return r0
}

// DisplayAddress provides a mock function with given fields: _a0, _a1
func (_m *Keystore) DisplayAddress(_a0 signing.AbsoluteKeypath, _a1 coin.Interface) error {
	ret := _m.Called(_a0, _a1)

	var r0 error
	if rf, ok := ret.Get(0).(func(signing.AbsoluteKeypath, coin.Interface) error); ok {
		r0 = rf(_a0, _a1)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// ExtendedPublicKey provides a mock function with given fields: _a0
func (_m *Keystore) ExtendedPublicKey(_a0 signing.AbsoluteKeypath) (*hdkeychain.ExtendedKey, error) {
	ret := _m.Called(_a0)

	var r0 *hdkeychain.ExtendedKey
	if rf, ok := ret.Get(0).(func(signing.AbsoluteKeypath) *hdkeychain.ExtendedKey); ok {
		r0 = rf(_a0)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*hdkeychain.ExtendedKey)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(signing.AbsoluteKeypath) error); ok {
		r1 = rf(_a0)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// HasSecureOutput provides a mock function with given fields:
func (_m *Keystore) HasSecureOutput() bool {
	ret := _m.Called()

	var r0 bool
	if rf, ok := ret.Get(0).(func() bool); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(bool)
	}

	return r0
}

// Identifier provides a mock function with given fields:
func (_m *Keystore) Identifier() (string, error) {
	ret := _m.Called()

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// SignTransaction provides a mock function with given fields: proposedTransaction
func (_m *Keystore) SignTransaction(proposedTransaction interface{}) (coin.ProposedTransaction, error) {
	ret := _m.Called(proposedTransaction)

	var r0 coin.ProposedTransaction
	if rf, ok := ret.Get(0).(func(interface{}) coin.ProposedTransaction); ok {
		r0 = rf(proposedTransaction)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(coin.ProposedTransaction)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(interface{}) error); ok {
		r1 = rf(proposedTransaction)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}